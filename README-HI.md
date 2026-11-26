# YTcreate Dosto — ElevenLabs API Starter

यह starter project आपकी demo website को ElevenLabs Text-to-Speech API से जोड़ता है।

## जरूरी बातें
- API key केवल server की `.env` फाइल में रखें।
- API key कभी भी `public` folder, HTML, GitHub या browser JavaScript में न डालें।
- यह अभी शुरुआती integration है; public launch से पहले login, per-user credits, payment verification, stronger abuse protection और privacy/terms pages जोड़ें।
- ElevenLabs usage आपके account plan/credits के अनुसार charge हो सकता है।

## चलाने का तरीका
1. Node.js 20 या नया install करें।
2. इस folder में terminal खोलें।
3. `npm install` चलाएँ।
4. `.env.example` की copy बनाकर उसका नाम `.env` रखें।
5. `.env` में अपना ElevenLabs API key डालें।
6. `npm start` चलाएँ।
7. Browser में `http://localhost:3000` खोलें।

## API key कहाँ से लें
ElevenLabs account में जाएँ: https://elevenlabs.io/app/settings/api-keys
नई API key बनाएँ और Text to Speech access दें। Key को केवल `.env` में डालें।

## क्या काम करता है
- Account के accessible voices को server से लोड करना
- Text-to-speech generation
- MP3 audio response और browser playback/download
- Basic input validation और rate limiting

## क्या अभी शामिल नहीं है
- User login/signup
- Payment gateway / subscription activation
- User-wise credits or quota ledger
- Admin dashboard
- Production hosting / domain

Paid plans बेचने से पहले server-side payment webhook verification और credit deduction लागू करना जरूरी है।
