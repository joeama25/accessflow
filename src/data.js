// src/data.js

export const MOCK_USERS = {
  "1234": { name: "Amaka Okafor", initials: "AO", balance: 250000, account: "4021" },
  "2167": { name: "Chinedu Okoye", initials: "CO", balance: 850000, account: "8890" },
  "0000": { name: "Blessing Michael", initials: "BM", balance: 45000, account: "1234" }
};

// ADDED: This was missing and causing the blank page error
export const LANGS = [
  { id: "en", native: "English" },
  { id: "pcm", native: "Pidgin" },
  { id: "yo", native: "Yoruba" },
  { id: "ig", native: "Igbo" },
  { id: "ha", native: "Hausa" },
];

// 1. SINGLE SOURCE OF TRUTH FOR ALL ACCOUNTS
export const ALL_RECIPIENTS = [
  { id: "chidi", name: "CHIDI BALOGUN", bank: "GTBank", avatar: "https://i.pravatar.cc/150?u=chidi", account: "7047062167" },
  { id: "ngozi", name: "NGOZI EZE", bank: "Kuda MFB", avatar: "https://i.pravatar.cc/150?u=ngozi", account: "8080773135" },
  { id: "tunde", name: "TUNDE ADEYEMI", bank: "Access Bank", avatar: "https://i.pravatar.cc/150?u=tunde", account: "9119072394" },
  { id: "blessing", name: "BLESSING MICHAEL", bank: "OPay", avatar:"https://i.pravatar.cc/150?u=blessing", account:"6417398482" },
  { id: "chinedu", name: "CHINEDU GODWIN OKOYE", bank: "OPay", avatar:"https://i.pravatar.cc/150?u=chinedu", account:"0123456789" },
];

// 2. AUTOMATICALLY GENERATE MOCK_ACCOUNTS FROM THE LIST ABOVE
export const MOCK_ACCOUNTS = ALL_RECIPIENTS.reduce((acc, contact) => {
  acc[contact.account] = contact;
  return acc;
}, {});

// 3. KEEP CONTACTS FOR THE RECENTS LIST
export const CONTACTS = ALL_RECIPIENTS.slice(0, 4); // First 4 for recents

export const RECENT_AMOUNTS = { chidi: 20000, ngozi: 12500, tunde: 34000 };