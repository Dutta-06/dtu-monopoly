import React, { createContext, useContext, useState } from 'react';
import { BOARD_SPACES } from '../data/board';
import { CHANCE_CARDS, CHEST_CARDS } from '../data/cards';
import { recordGameStart } from '../lib/supabase';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [propertyOwnership, setPropertyOwnership] = useState({}); // { spaceId: playerId }
  const [propertyLevels, setPropertyLevels] = useState({}); // { spaceId: level } 0, 1, 2
  const [pendingAction, setPendingAction] = useState(null);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [boardSpaces, setBoardSpaces] = useState(BOARD_SPACES);
  const [goReward, setGoReward] = useState(200);

  const updatePropertyPrice = (spaceId, newPrice) => {
    setBoardSpaces(prev => prev.map(space => {
      if (space.id === spaceId) {
        return {
          ...space,
          price: Math.max(0, parseInt(newPrice, 10) || 0)
        };
      }
      return space;
    }));
  };

  const resetPropertyPrices = () => {
    setBoardSpaces(BOARD_SPACES);
    setGoReward(200);
  };

  const calculateNetWorth = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return 0;
    let propertyValue = 0;
    boardSpaces.forEach(space => {
      if (propertyOwnership[space.id] === playerId) {
        const level = propertyLevels[space.id] || 0;
        propertyValue += (space.price || 0) + (level * (space.upgradeCost || 0));
      }
    });
    return player.balance + propertyValue;
  };

  const endGame = () => {
    setPendingAction({
      type: 'info',
      title: 'End Game & Declare Winner?',
      message: 'Ready to conclude the game and see who has the highest Net Worth (Cash + Property Assets)?',
      confirmText: 'Yes, End Game!',
      rejectText: 'Keep Playing',
      onConfirm: () => {
        setPendingAction(null);
        setWinnerModalOpen(true);
      },
      onReject: () => {
        setPendingAction(null);
      }
    });
  };

  const resetGame = () => {
    setPlayers([]);
    setIsGameStarted(false);
    setCurrentPlayerIndex(0);
    setPropertyOwnership({});
    setPropertyLevels({});
    setPendingAction(null);
    setWinnerModalOpen(false);
  };

  const startGame = (playerDataList) => {
    const newPlayers = playerDataList
      .filter(item => (typeof item === 'string' ? item.trim() !== '' : item.name.trim() !== ''))
      .map((item, index) => {
        const name = typeof item === 'string' ? item : item.name;
        const avatar = typeof item === 'string' ? `/avatar-${index + 1}.png` : item.avatar;
        return {
          id: index,
          name,
          avatar,
          balance: 1500,
          position: 0,
          inJail: false,
          isBankrupt: false,
        };
      });
    setPlayers(newPlayers);
    setIsGameStarted(true);
    setCurrentPlayerIndex(0);
    // Record session to Supabase — fire-and-forget, never blocks the game
    recordGameStart(newPlayers.map(p => p.name));
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
    // Return properties to bank and reset their levels
    setPropertyOwnership(prevOwn => {
      const newOwn = { ...prevOwn };
      setPropertyLevels(prevLvls => {
        const newLvls = { ...prevLvls };
        Object.keys(prevOwn).forEach(k => {
          if (prevOwn[k] === playerId) {
            delete newOwn[k];
            delete newLvls[k];
          }
        });
        return newLvls;
      });
      return newOwn;
    });

    setPlayers(prev => {
      const updated = prev.map(p => p.id === playerId ? { ...p, balance: 0, isBankrupt: true } : p);
      const active = updated.filter(p => !p.isBankrupt);
      if (active.length <= 1) {
        setTimeout(() => setWinnerModalOpen(true), 500);
      }
      return updated;
    });
  };

  // Safe balance updater that returns true if successful, false if bankrupt
  const updateBalance = (playerId, amount) => {
    const targetPlayer = players.find(p => p.id === playerId);
    if (!targetPlayer) return false;

    if (targetPlayer.balance + amount < 0) {
      handleBankruptcy(playerId);
      setPendingAction({
        type: 'info',
        title: 'BANKRUPT!',
        message: `${targetPlayer.name} went bankrupt and is eliminated from the game! All their properties have been returned to the bank.`,
        confirmText: 'Aww man...',
        onConfirm: () => {
          nextTurn();
          setPendingAction(null);
        }
      });
      return false;
    }

    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, balance: p.balance + amount };
      }
      return p;
    }));
    return true;
  };

  const buyProperty = (playerId, spaceId, price) => {
    const p = players.find(player => player.id === playerId);
    if (!p || p.balance < price) return;
    updateBalance(playerId, -price);
    setPropertyOwnership(prev => ({ ...prev, [spaceId]: playerId }));
    setPropertyLevels(prev => ({ ...prev, [spaceId]: 0 }));
    nextTurn();
  };

  const upgradeProperty = (playerId, spaceId, cost, currentLevel) => {
    const p = players.find(player => player.id === playerId);
    if (!p || p.balance < cost) return;
    updateBalance(playerId, -cost);
    setPropertyLevels(prev => ({ ...prev, [spaceId]: currentLevel + 1 }));
    nextTurn();
  };

  const payRent = (fromPlayerId, toPlayerId, amount) => {
    const success = updateBalance(fromPlayerId, -amount);
    if (success) {
      updateBalance(toPlayerId, amount);
      nextTurn();
      setPendingAction(null);
    }
  };

  const processCardEffect = (player, cardData, spaceId) => {
    if (!cardData) { nextTurn(); return; }

    const performEffect = () => {
      let survived = true;
      if (cardData.type === 'pay') {
        survived = updateBalance(player.id, -cardData.amount);
        if (survived) nextTurn();
      } else if (cardData.type === 'collect') {
        updateBalance(player.id, cardData.amount);
        nextTurn();
      } else if (cardData.type === 'move_absolute') {
        let passedGo = false;
        if (cardData.position === 0 && player.position > 0) passedGo = true; // "Advance to Go"
        if (passedGo) updateBalance(player.id, 200);
        setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, position: cardData.position, inJail: !!cardData.inJail } : p));
        nextTurn();
      } else if (cardData.type === 'move_relative') {
        let newPos = player.position + cardData.amount;
        if (newPos < 0) newPos += 40;
        setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, position: newPos } : p));
        nextTurn();
      } else if (cardData.type === 'pay_all') {
        let amountNeeded = cardData.amount * (players.filter(p=>!p.isBankrupt).length - 1);
        survived = updateBalance(player.id, -amountNeeded);
        if (survived) {
          players.forEach(p => {
            if (!p.isBankrupt && p.id !== player.id) updateBalance(p.id, cardData.amount);
          });
          nextTurn();
        }
      } else if (cardData.type === 'collect_all') {
        let totalCollected = 0;
        players.forEach(p => {
          if (!p.isBankrupt && p.id !== player.id) {
            updateBalance(p.id, -cardData.amount);
            totalCollected += cardData.amount;
          }
        });
        updateBalance(player.id, totalCollected);
        nextTurn();
      } else {
        nextTurn();
      }
      if (survived) setPendingAction(null);
    };

    setPendingAction({
      type: 'info',
      spaceId: spaceId,
      title: cardData.title,
      message: cardData.message,
      confirmText: 'Okay',
      onConfirm: performEffect
    });
  };

  const executeMove = (player, newPos, passedGo, totalRoll) => {
    let goMessage = passedGo ? `Passed GO! Collected M${goReward}. ` : '';
    const space = boardSpaces[newPos];

    setPlayers(prev => prev.map(p => {
      if (p.id === player.id) {
        return { ...p, position: newPos, balance: p.balance + (passedGo ? goReward : 0) };
      }
      return p;
    }));

    if (space.type === 'property' || space.type === 'station' || space.type === 'utility') {
      const ownerId = propertyOwnership[space.id];
      if (ownerId === undefined) {
        setPendingAction({
          type: 'buy',
          spaceId: space.id,
          title: `Landed on ${space.name}`,
          message: `${goMessage}It's unowned! Would you like to buy it for M${space.price}?`,
          confirmText: 'Buy',
          rejectText: 'Skip',
          onConfirm: () => {
            if (player.balance < space.price) {
              setPendingAction({
                type: 'info',
                spaceId: space.id,
                title: 'Not Enough Money!',
                message: `You need M${space.price} to buy ${space.name}, but you only have M${player.balance}.`,
                confirmText: 'Okay',
                onConfirm: () => { nextTurn(); setPendingAction(null); }
              });
            } else {
              buyProperty(player.id, space.id, space.price);
              setPendingAction(null);
            }
          },
          onReject: () => { nextTurn(); setPendingAction(null); }
        });
      } else if (ownerId === player.id) {
        const currentLevel = propertyLevels[space.id] || 0;
        if (space.type === 'property' && currentLevel < 2) {
          // Can upgrade
          setPendingAction({
            type: 'buy',
            spaceId: space.id,
            title: `Landed on your ${space.name}`,
            message: `${goMessage}You own this (Level ${currentLevel}). Upgrade to Level ${currentLevel + 1} for M${space.upgradeCost}?`,
            confirmText: 'Upgrade',
            rejectText: 'Skip',
            onConfirm: () => {
              if (player.balance < space.upgradeCost) {
                setPendingAction({
                  type: 'info',
                  spaceId: space.id,
                  title: 'Not Enough Money!',
                  message: `You need M${space.upgradeCost} to upgrade ${space.name}, but you only have M${player.balance}.`,
                  confirmText: 'Okay',
                  onConfirm: () => { nextTurn(); setPendingAction(null); }
                });
              } else {
                upgradeProperty(player.id, space.id, space.upgradeCost, currentLevel);
                setPendingAction(null);
              }
            },
            onReject: () => { nextTurn(); setPendingAction(null); }
          });
        } else {
          setPendingAction({
            type: 'info',
            spaceId: space.id,
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
          spaceId: space.id,
          title: `Landed on ${space.name}`,
          message: `${goMessage}Owned by ${owner.name} (Level ${level}). You paid M${rent} in rent!`,
          confirmText: 'Pay & End Turn',
          onConfirm: () => { 
            const success = updateBalance(player.id, -rent);
            if (success) {
              updateBalance(owner.id, rent);
              nextTurn();
              setPendingAction(null);
            }
          }
        });
      }
    } else if (space.type === 'tax') {
      setPendingAction({
        type: 'info',
        spaceId: space.id,
        title: `Tax: ${space.name}`,
        message: `${goMessage}Pay M${space.amount}.`,
        confirmText: 'Pay & End Turn',
        onConfirm: () => { 
          const success = updateBalance(player.id, -space.amount);
          if (success) {
            nextTurn();
            setPendingAction(null);
          }
        }
      });
    } else if (space.type === 'gotojail') {
      setPendingAction({
        type: 'info',
        spaceId: space.id,
        title: `Detention!`,
        message: `Go directly to Fail. Do not pass GO, do not collect M200.`,
        confirmText: 'Go to Fail',
        onConfirm: () => {
          setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, position: 10, inJail: true } : p));
          nextTurn();
          setPendingAction(null);
        }
      });
    } else if (space.type === 'chance') {
      const card = CHANCE_CARDS[totalRoll];
      processCardEffect(player, card, space.id);
    } else if (space.type === 'chest') {
      const card = CHEST_CARDS[totalRoll];
      processCardEffect(player, card, space.id);
    } else {
      setPendingAction({
        type: 'info',
        spaceId: space.id,
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
          type: 'info', title: 'Escaped Fail!', message: 'You rolled doubles! You are free. Roll again next turn.',
          confirmText: 'End Turn', onConfirm: () => { nextTurn(); setPendingAction(null); }
        });
      } else {
        setPendingAction({
          type: 'info', title: 'Still in Fail', message: 'You did not roll doubles.',
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
      winnerModalOpen,
      setWinnerModalOpen,
      calculateNetWorth,
      endGame,
      resetGame,
      startGame,
      updateBalance,
      handleRoll,
      nextTurn,
      boardSpaces,
      updatePropertyPrice,
      resetPropertyPrices,
      goReward,
      setGoReward
    }}>
      {children}
    </GameContext.Provider>
  );
};
