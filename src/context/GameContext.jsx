import React, { createContext, useContext, useState } from 'react';
import { BOARD_SPACES } from '../data/board';
import { CHANCE_CARDS, CHEST_CARDS } from '../data/cards';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [propertyOwnership, setPropertyOwnership] = useState({}); // { spaceId: playerId }
  const [propertyLevels, setPropertyLevels] = useState({}); // { spaceId: level } 0, 1, 2
  const [pendingAction, setPendingAction] = useState(null);

  const startGame = (playerNames) => {
    const newPlayers = playerNames.filter(n => n.trim() !== '').map((name, index) => ({
      id: index,
      name,
      balance: 1500,
      position: 0,
      inJail: false,
      isBankrupt: false,
    }));
    setPlayers(newPlayers);
    setIsGameStarted(true);
    setCurrentPlayerIndex(0);
  };

  const getNextValidPlayerIndex = (currentIndex, currentPlayers) => {
    let nextIdx = (currentIndex + 1) % currentPlayers.length;
    let loopCount = 0;
    while (currentPlayers[nextIdx].isBankrupt && loopCount < currentPlayers.length) {
      nextIdx = (nextIdx + 1) % currentPlayers.length;
      loopCount++;
    }
    return nextIdx;
  };

  const nextTurn = () => {
    setPlayers(prevPlayers => {
      const nextIdx = getNextValidPlayerIndex(currentPlayerIndex, prevPlayers);
      setCurrentPlayerIndex(nextIdx);
      return prevPlayers;
    });
  };

  const handleBankruptcy = (playerId) => {
    // Return properties to bank
    setPropertyOwnership(prev => {
      const newOwn = { ...prev };
      Object.keys(newOwn).forEach(k => {
        if (newOwn[k] === playerId) delete newOwn[k];
      });
      return newOwn;
    });
    setPropertyLevels(prev => {
      const newLvls = { ...prev };
      // we don't have owner info in levels directly, but since ownership is reset, we should also reset levels
      // to be safe, let's just reset all levels for properties owned by this player
      // wait, we can just look at propertyOwnership
      Object.keys(propertyOwnership).forEach(k => {
        if (propertyOwnership[k] === playerId) delete newLvls[k];
      });
      return newLvls;
    });
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, balance: 0, isBankrupt: true } : p));
  };

  // Safe balance updater that returns true if successful, false if bankrupt
  const updateBalance = (playerId, amount) => {
    let success = true;
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        if (p.balance + amount < 0) {
          success = false;
          return p; // don't update yet, handleBankruptcy will do it
        }
        return { ...p, balance: p.balance + amount };
      }
      return p;
    }));
    
    if (!success) {
      handleBankruptcy(playerId);
      const player = players.find(p => p.id === playerId);
      setPendingAction({
        type: 'info',
        title: 'BANKRUPT!',
        message: `${player.name} went bankrupt and is eliminated from the game!`,
        confirmText: 'Aww man...',
        onConfirm: () => {
          nextTurn();
          setPendingAction(null);
        }
      });
    }
    return success;
  };

  const buyProperty = (playerId, spaceId, price) => {
    if (updateBalance(playerId, -price)) {
      setPropertyOwnership(prev => ({ ...prev, [spaceId]: playerId }));
      setPropertyLevels(prev => ({ ...prev, [spaceId]: 0 }));
      nextTurn();
    }
  };

  const upgradeProperty = (playerId, spaceId, cost, currentLevel) => {
    if (updateBalance(playerId, -cost)) {
      setPropertyLevels(prev => ({ ...prev, [spaceId]: currentLevel + 1 }));
      nextTurn();
    }
  };

  const payRent = (fromPlayerId, toPlayerId, amount) => {
    if (updateBalance(fromPlayerId, -amount)) {
      updateBalance(toPlayerId, amount);
      nextTurn();
    }
  };

  const processCardEffect = (player, cardData) => {
    if (!cardData) { nextTurn(); return; }

    const performEffect = () => {
      if (cardData.type === 'pay') {
        if (updateBalance(player.id, -cardData.amount)) nextTurn();
      } else if (cardData.type === 'collect') {
        updateBalance(player.id, cardData.amount);
        nextTurn();
      } else if (cardData.type === 'move_absolute') {
        let passedGo = false;
        if (cardData.position === 0 && player.position > 0) passedGo = true; // "Advance to Go"
        // Wait, for simplicity, if moving absolutely, don't trigger full executeMove again unless needed.
        // Let's just update position and end turn.
        if (passedGo) updateBalance(player.id, 200);
        setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, position: cardData.position, inJail: !!cardData.inJail } : p));
        nextTurn();
      } else if (cardData.type === 'move_relative') {
        let newPos = player.position + cardData.amount;
        if (newPos < 0) newPos += 40;
        setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, position: newPos } : p));
        nextTurn(); // Simple end turn to avoid infinite loops
      } else if (cardData.type === 'pay_all') {
        let ok = updateBalance(player.id, -(cardData.amount * (players.filter(p=>!p.isBankrupt).length - 1)));
        if (ok) {
          players.forEach(p => {
            if (!p.isBankrupt && p.id !== player.id) updateBalance(p.id, cardData.amount);
          });
          nextTurn();
        }
      } else if (cardData.type === 'collect_all') {
        // Collect from everyone
        let totalCollected = 0;
        players.forEach(p => {
          if (!p.isBankrupt && p.id !== player.id) {
            updateBalance(p.id, -cardData.amount); // Simplification: assuming others don't go bankrupt from M10
            totalCollected += cardData.amount;
          }
        });
        updateBalance(player.id, totalCollected);
        nextTurn();
      } else {
        nextTurn();
      }
      setPendingAction(null);
    };

    setPendingAction({
      type: 'info',
      title: cardData.title,
      message: cardData.message,
      confirmText: 'Okay',
      onConfirm: performEffect
    });
  };

  const executeMove = (player, newPos, passedGo, totalRoll) => {
    let goMessage = passedGo ? `Passed GO! Collected M200. ` : '';
    const space = BOARD_SPACES[newPos];

    setPlayers(prev => prev.map(p => {
      if (p.id === player.id) {
        return { ...p, position: newPos, balance: p.balance + (passedGo ? 200 : 0) };
      }
      return p;
    }));

    if (space.type === 'property' || space.type === 'station' || space.type === 'utility') {
      const ownerId = propertyOwnership[space.id];
      if (ownerId === undefined) {
        setPendingAction({
          type: 'buy',
          title: `Landed on ${space.name}`,
          message: `${goMessage}It's unowned! Would you like to buy it for M${space.price}?`,
          confirmText: 'Buy',
          rejectText: 'Skip',
          onConfirm: () => { buyProperty(player.id, space.id, space.price); setPendingAction(null); },
          onReject: () => { nextTurn(); setPendingAction(null); }
        });
      } else if (ownerId === player.id) {
        const currentLevel = propertyLevels[space.id] || 0;
        if (space.type === 'property' && currentLevel < 2) {
          // Can upgrade
          setPendingAction({
            type: 'buy',
            title: `Landed on your ${space.name}`,
            message: `${goMessage}You own this (Level ${currentLevel}). Upgrade to Level ${currentLevel + 1} for M${space.upgradeCost}?`,
            confirmText: 'Upgrade',
            rejectText: 'Skip',
            onConfirm: () => { upgradeProperty(player.id, space.id, space.upgradeCost, currentLevel); setPendingAction(null); },
            onReject: () => { nextTurn(); setPendingAction(null); }
          });
        } else {
          setPendingAction({
            type: 'info',
            title: `Landed on ${space.name}`,
            message: `${goMessage}You own this. Relax!`,
            confirmText: 'End Turn',
            onConfirm: () => { nextTurn(); setPendingAction(null); }
          });
        }
      } else {
        const owner = players.find(p => p.id === ownerId);
        const level = propertyLevels[space.id] || 0;
        const multiplier = level === 1 ? 3 : (level === 2 ? 6 : 1);
        let rent = (space.rent || (space.type === 'station' ? 25 : 10)) * multiplier;
        
        setPendingAction({
          type: 'info',
          title: `Landed on ${space.name}`,
          message: `${goMessage}Owned by ${owner.name} (Level ${level}). You paid M${rent} in rent!`,
          confirmText: 'Pay & End Turn',
          onConfirm: () => { payRent(player.id, owner.id, rent); setPendingAction(null); }
        });
      }
    } else if (space.type === 'tax') {
      setPendingAction({
        type: 'info',
        title: `Tax: ${space.name}`,
        message: `${goMessage}Pay M${space.amount}.`,
        confirmText: 'Pay & End Turn',
        onConfirm: () => { if (updateBalance(player.id, -space.amount)) nextTurn(); setPendingAction(null); }
      });
    } else if (space.type === 'gotojail') {
      setPendingAction({
        type: 'info',
        title: `Detained!`,
        message: `Go directly to jail. Do not pass GO, do not collect M200.`,
        confirmText: 'Go to Jail',
        onConfirm: () => {
          setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, position: 10, inJail: true } : p));
          nextTurn();
          setPendingAction(null);
        }
      });
    } else if (space.type === 'chance') {
      const card = CHANCE_CARDS[totalRoll];
      processCardEffect(player, card);
    } else if (space.type === 'chest') {
      const card = CHEST_CARDS[totalRoll];
      processCardEffect(player, card);
    } else {
      setPendingAction({
        type: 'info',
        title: `Landed on ${space.name}`,
        message: `${goMessage}Take a breather.`,
        confirmText: 'End Turn',
        onConfirm: () => { nextTurn(); setPendingAction(null); }
      });
    }
  };

  const handleRoll = (total, isDouble) => {
    const player = players[currentPlayerIndex];
    if (!player || player.isBankrupt) return;
    
    if (player.inJail) {
      if (isDouble) {
        setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, inJail: false } : p));
        setPendingAction({
          type: 'info', title: 'Escaped Jail!', message: 'You rolled doubles! You are free. Roll again next turn.',
          confirmText: 'End Turn', onConfirm: () => { nextTurn(); setPendingAction(null); }
        });
      } else {
        setPendingAction({
          type: 'info', title: 'Still in Jail', message: 'You did not roll doubles.',
          confirmText: 'End Turn', onConfirm: () => { nextTurn(); setPendingAction(null); }
        });
      }
      return;
    }

    let newPos = player.position + total;
    let passedGo = false;
    if (newPos >= 40) {
      newPos = newPos - 40;
      passedGo = true;
    }

    executeMove(player, newPos, passedGo, total);
  };

  return (
    <GameContext.Provider value={{
      players,
      isGameStarted,
      currentPlayerIndex,
      propertyOwnership,
      propertyLevels,
      pendingAction,
      startGame,
      updateBalance,
      handleRoll,
      nextTurn
    }}>
      {children}
    </GameContext.Provider>
  );
};
