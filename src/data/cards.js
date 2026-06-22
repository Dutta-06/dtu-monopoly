export const CHANCE_CARDS = {
  2: { title: "Speeding on Golf Cart", message: "Pay M15 fine.", type: "pay", amount: 15 },
  3: { title: "Go Back", message: "Go back 3 spaces.", type: "move_relative", amount: -3 },
  4: { title: "Caught Bunking", message: "Go directly to Jail.", type: "move_absolute", position: 10, inJail: true },
  5: { title: "Hostel Fees", message: "Pay mess fee M50.", type: "pay", amount: 50 },
  6: { title: "Trip to Raj Soin", message: "Advance to Raj Soin. If you pass GO, collect 200.", type: "move_absolute", position: 9 },
  7: { title: "Society President", message: "Pay each player M50.", type: "pay_all", amount: 50 },
  8: { title: "Scholarship", message: "Collect M150.", type: "collect", amount: 150 },
  9: { title: "Advance to GO", message: "Advance to GO. Collect M200.", type: "move_absolute", position: 0 },
  10: { title: "Trip to Concert", message: "Advance to Concert Ground.", type: "move_absolute", position: 39 },
  11: { title: "Library Fine", message: "Pay late fee M25.", type: "pay", amount: 25 },
  12: { title: "Hackathon Winner", message: "You won first prize! Collect M100.", type: "collect", amount: 100 },
};

export const CHEST_CARDS = {
  2: { title: "Advance to GO", message: "Advance to GO. Collect M200.", type: "move_absolute", position: 0 },
  3: { title: "Bank Error", message: "Bank error in your favor. Collect M200.", type: "collect", amount: 200 },
  4: { title: "Health Centre", message: "Doctor's fee. Pay M50.", type: "pay", amount: 50 },
  5: { title: "Stock Sale", message: "Sale of stock. Collect M50.", type: "collect", amount: 50 },
  6: { title: "Caught Cheating", message: "Go to Jail.", type: "move_absolute", position: 10, inJail: true },
  7: { title: "Holiday Fund", message: "Holiday fund matures. Collect M100.", type: "collect", amount: 100 },
  8: { title: "Tax Refund", message: "Income tax refund. Collect M20.", type: "collect", amount: 20 },
  9: { title: "Birthday", message: "It is your birthday. Collect M10 from every player.", type: "collect_all", amount: 10 },
  10: { title: "Life Insurance", message: "Life insurance matures. Collect M100.", type: "collect", amount: 100 },
  11: { title: "Hospital Fees", message: "Pay hospital M100.", type: "pay", amount: 100 },
  12: { title: "Beauty Contest", message: "Won DTU pageant. Collect M10.", type: "collect", amount: 10 },
};
