# AccessFlow AI - Accessibility Banking

## AI Usage Explanation
This project uses Artificial Intelligence to create an inclusive banking experience:
- **Voice Banking (Web Speech API)**: A custom AI state machine listens for commands, guiding users through a multi-step transfer flow (Account Number -> Amount -> Confirmation).
- **TTS (Text-to-Speech)**: Integrated with the browser's native `speechSynthesis` and the **YarnGPT API** for reading out account balances and transfer details.
- **Idle Assistant**: A 10-second inactivity timer that triggers an AI voice prompt to guide the user.
- **Fallback Logic**: If the AI backend is offline or fails, the app automatically falls back to native browser speech synthesis so the visually impaired user is never left in silence.