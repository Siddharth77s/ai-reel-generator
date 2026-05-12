# AI Reel Script & Thumbnail Generator

An AI-powered platform for content creators to generate viral short-form video content using Google Gemini.

## 🚀 Features

- 🔐 User Authentication (Login / Signup)
- ✍️ AI Script Generation
- 🎯 Viral Hooks
- 📝 Captions & Hashtags
- 🎬 Scene Breakdown
- 🖼️ Thumbnail Generation
- 📊 Viral Score Prediction
- 📁 Script Management (Save, Edit, Duplicate, Organize)
- 📈 Content Dashboard
- ☁️ Deployed on Vercel

## 🛠️ Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

### AI Integration
- Google Gemini API (`gemini-2.5-flash`)

### Deployment
- Vercel

## 📦 Installation

```bash
git clone https://github.com/YOUR_USERNAME/ai-reel-generator.git
cd ai-reel-generator
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## ▶️ Run Locally

```bash
npm run dev
```

## 🌐 Deployment

Deploy easily using Vercel:

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add `VITE_GEMINI_API_KEY` in Environment Variables.
4. Deploy.

## 📁 Project Structure

```text
src/
├── components/
├── pages/
├── contexts/
├── services/
│   └── gemini.ts
├── utils/
└── App.tsx
```

## 🎯 Assignment Requirements Covered

- Authentication
- AI Script Generation
- Thumbnail Generation
- Script Management
- Dashboard
- Bonus Features:
  - Viral Score Prediction
  - Trending Suggestions
  - Storyboard Placeholder

## ⚠️ Note About Gemini Quota

This project uses the free tier of Google Gemini. If you encounter:

- `429 Too Many Requests`

wait a few minutes or use a new API key.

## 📸 Screenshots

Add screenshots of:
- Dashboard
- Script Generator
- Thumbnail Generator
- Scripts Library

## 🔮 Future Enhancements

- Real Gemini image generation
- Voice synthesis
- Subtitle generation
- Collaboration
- Multi-platform optimization

## 👨‍💻 Author

Siddharth Shinde

- GitHub: https://github.com/siddharth77s
- LinkedIn: https://www.linkedin.com/in/siddharthshinde

## 📄 License

This project is developed for educational and assignment purposes.
