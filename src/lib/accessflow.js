export const DEMO_BALANCE = 250000;
export const formatNaira = (val) => `₦${val.toLocaleString()}`;

export const PROFILES = [
  { id: "vi", name: "Visually Impaired", short: "VI", tagline: "High contrast and spoken guidance" },
  { id: "motor", name: "Motor Skills", short: "MS", tagline: "Large controls and voice input" },
  { id: "lang", name: "Language Barrier", short: "LB", tagline: "Simplified banking in local dialects" },
];

export const LANGS = [
  { id: "en", native: "English", ttsCode: "en-NG" },
  { id: "pcm", native: "Pidgin", ttsCode: "en-NG" },
  { id: "yo", native: "Yoruba", ttsCode: "yo-NG" },
  { id: "ig", native: "Igbo", ttsCode: "ig-NG" },
  { id: "ha", native: "Hausa", ttsCode: "ha-NG" },
];

export const COPY = {
  en: {
    greeting: "Good morning", balance: "Available Balance", sendMoney: "Send Money", topUp: "Deposit",
    history: "History", settings: "Settings", pinPrompt: "Enter your PIN", pinHint: "Your 4-digit PIN",
    chooseLang: "Choose Language", accountNo: "Recipient Account", amount: "Amount", reviewSend: "Review & Send",
    errTitle: "Transfer Failed", errMsg: "Insufficient funds or invalid account.", retry: "Try Again",
    session: "Session", whoTo: "Who to?", listening: "Listening...", sent: "Sent!", sentTo: "to",
    receipt: "Reference", playReceipt: "Play Receipt Aloud", done: "Done", sayPin: "Say your PIN", sayAmount: "Say amount",
    faceIdPrompt: "Raise your phone to scan your face.", scanningFace: "Scanning face...", faceSuccess: "Face recognized. Logging you in.",
    voiceCommandPrompt: "Say a command: Send, Cancel, or say an amount.", verifyBiometrics: "Verify with Fingerprint",
    scanningFingerprint: "Scanning fingerprint...", biometricSuccess: "Verification successful."
  },
  pcm: {
    greeting: "Good morning", balance: "Money wey dey inside", sendMoney: "Send Money", topUp: "Add Money",
    history: "Old transfers", settings: "Settings", pinPrompt: "Put your PIN", pinHint: "4-digit PIN",
    chooseLang: "Pick Language", accountNo: "Who you dey send to?", amount: "How much?", reviewSend: "Check & send",
    errTitle: "Transfer fail", errMsg: "Account no correct or money no dey.", retry: "Try again",
    session: "Time", whoTo: "Who?", listening: "I dey listen...", sent: "E don go!", sentTo: "give",
    receipt: "Reference", playReceipt: "Listen to receipt", done: "Done", sayPin: "Talk your PIN", sayAmount: "Talk amount",
    faceIdPrompt: "Lift your phone make we scan your face.", scanningFace: "We dey scan face...", faceSuccess: "We don see your face. You dey enter.",
    voiceCommandPrompt: "Talk command: Send, Cancel, or talk amount.", verifyBiometrics: "Use Fingerprint",
    scanningFingerprint: "We dey scan finger...", biometricSuccess: "E don verify."
  },
  ig: {
    greeting: "Ụtụtụ ọma", balance: "Ego dị", sendMoney: "Zipu Ego", topUp: "Tinye Ego",
    history: "Akụkọ", settings: "Ntọala", pinPrompt: "Tinye PIN gị", pinHint: "PIN anọ",
    chooseLang: "Họrọ Asụsụ", accountNo: "Onye ị na-eziga", amount: "Ego ole?", reviewSend: "Lelee & Zipu",
    errTitle: "Mmechi", errMsg: "Ego ezughi ma ọ bụ akaụntụ adịghị mma.", retry: "Nwaa ọzọ",
    session: "Oge", whoTo: "Onye?", listening: "Ana m ege ntị...", sent: "E zipula!", sentTo: "nara",
    receipt: "Ntụaka", playReceipt: "Gụọ akwụkwọ", done: "Mechaa", sayPin: "Kwuo PIN gị", sayAmount: "Kwuo ego",
    faceIdPrompt: "Welite ekwentị gị ka anyị lee ihu gị.", scanningFace: "Anyị na-ele ihu gị...", faceSuccess: "Anyị hụrụ ihu gị. Ị na-abanye.",
    voiceCommandPrompt: "Kwuo iwu: Zipu, Kagbuo, ma ọ bụ kwuo ego.", verifyBiometrics: "Jiri akara mkpisi aka",
    scanningFingerprint: "Anyị na-ele akara aka...", biometricSuccess: "Nkwenye gara nke ọma."
  },
  yo: {
    greeting: "E kaaro", balance: "Owo to wa", sendMoney: "Firanse", topUp: "Fi kun",
    history: "Itan", settings: "Eto", pinPrompt: "Te PIN re", pinHint: "PIN mẹrin",
    chooseLang: "Yan Ede", accountNo: "Eni ti o n firanse si", amount: "Elo ni?", reviewSend: "Sayẹwo & Firanse",
    errTitle: "Ikuna", errMsg: "Ko to tabi akọọlẹ ko tọ", retry: "Gbiyanju lẹẹkansi",
    session: "Akoko", whoTo: "Ta ni?", listening: "Mo n gbọ...", sent: "Ti firanse!", sentTo: "si",
    receipt: "Itọkasi", playReceipt: "Ka iwe-ẹri naa", done: "Pari", sayPin: "Sọ PIN rẹ", sayAmount: "Sọ iye",
    faceIdPrompt: "Gbé fóònù rẹ sókè kí a lè wo ojú rẹ.", scanningFace: "A ń wo ojú rẹ...", faceSuccess: "A ti mọ ojú rẹ. Ì ń wọlé.",
    voiceCommandPrompt: "Sọ àṣẹ kan: Firanṣẹ, Fagilé, tàbí sọ iye owó.", verifyBiometrics: "Lo ìtẹ́lẹ̀ ika",
    scanningFingerprint: "A ń wo ìtẹ́lẹ̀ ika...", biometricSuccess: "Ìjẹ́rìí ṣe àṣeyọrí."
  },
  ha: {
    greeting: "Ina kwana", balance: "Kudi da ke", sendMoney: "Aika Kudi", topUp: "Kara Kudi",
    history: "Tarihi", settings: "Saiti", pinPrompt: "Shigar da PIN", pinHint: "PIN hudu",
    chooseLang: "Zabi Harshe", accountNo: "Wanda zaka aika", amount: "Nawa ne?", reviewSend: "Duba & Aika",
    errTitle: "Kasa", errMsg: "Kudi bai isa ba", retry: "Sake gwadawa",
    session: "Lokaci", whoTo: "Waye?", listening: "Ina saurare...", sent: "An aika!", sentTo: "ga",
    receipt: "Tuta", playReceipt: "Karanta rasit", done: "Kammala", sayPin: "Fadi PIN dinka", sayAmount: "Fadi adadin",
    faceIdPrompt: "Daga wayar ka don duba fuskarka.", scanningFace: "Ana duba fuska...", faceSuccess: "An gane fuskarka. Ana shigar da kai.",
    voiceCommandPrompt: "Fadi umarni: Aika, Soke, ko fadi adadi.", verifyBiometrics: "Yi amfani da yatsa",
    scanningFingerprint: "Ana duba yatsa...", biometricSuccess: "Tabbatarwa ta yi nasara."
  }
};