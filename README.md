# Joyla - Nearby Interesting Places Discovery App

Joyla helps users discover interesting places in Uzbekistan - nature spots, historical sites, restaurants, and entertainment venues. The app detects your location and shows nearby places on a map with beautiful 3D interactive cards.

## 🌟 Features

- **Location Detection**: Automatic geolocation with manual city selection fallback
- **Category Filters**: Nature, Historical/Cultural, Restaurants/Cafes, Entertainment
- **3D Interactive Cards**: Beautiful tilt effect on hover with place photos, ratings, and distance
- **Map View**: Interactive map with markers using Leaflet.js
- **Search**: Find places by name or city
- **Random Discovery**: "Where should I go today?" button for suggestions
- **Favorites**: Save places to your favorites list
- **Telegram Login**: Secure authentication via Telegram widget
- **Onboarding Tour**: Guided tour for first-time users
- **Bilingual**: Uzbek and Russian language support
- **Dark Mode**: Toggle between light and dark themes

## 🛠 Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS + daisyUI
- Zustand (state management)
- i18next (localization)
- Leaflet.js (maps)
- react-joyride (onboarding)
- react-router-dom (routing)

### Backend
- Node.js + Express
- Google Places API (primary)
- 2GIS API (fallback for Uzbekistan)
- Telegram Bot API (authentication)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. Install dependencies:
```bash
npm install
cd server && npm install && cd ..
```

2. Create a `.env` file in the `server/` directory based on `.env.example`:
```bash
cp server/.env.example server/.env
```

3. Add your API keys to `server/.env`:
```
PORT=3001
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
VITE_TELEGRAM_BOT_USERNAME=your_bot_username_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
TWOGIS_API_KEY=your_2gis_api_key_here
```

4. Start both frontend and backend with a single command:
```bash
npm run dev
```

This will start:
- **Frontend**: Vite dev server on http://localhost:5173
- **Backend**: Express API server on http://localhost:3001
- **Telegram Bot**: Polling for messages

### Individual Commands

If you need to run frontend and backend separately:

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

**Build for production:**
```bash
npm run build
```

## 🔑 API Keys Setup

### Telegram Bot
1. Create a bot via [@BotFather](https://t.me/botfather) on Telegram
2. Get your bot token
3. Set your domain using `/setdomain` command in BotFather (required for the login widget)
4. Add the token to your backend `.env` file

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the Places API
3. Create an API key with restrictions for your domain
4. Add the key to your backend `.env` file

### 2GIS API
1. Register at [2GIS Developer Portal](https://dev.2gis.com/)
2. Create an application and get your API key
3. Add the key to your backend `.env` file

## 📁 Project Structure

```
Joyla/
├── src/
│   ├── components/       # React components
│   │   ├── LocationDetector.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── PlaceCard.jsx
│   │   ├── PlaceList.jsx
│   │   ├── MapView.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SuggestButton.jsx
│   │   ├── TelegramLoginButton.jsx
│   │   └── OnboardingTour.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useTiltEffect.js
│   ├── store/           # Zustand stores
│   │   ├── useLocationStore.js
│   │   ├── usePlacesStore.js
│   │   ├── useFavoritesStore.js
│   │   ├── useAuthStore.js
│   │   └── useOnboardingStore.js
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   └── Favorites.jsx
│   ├── i18n/            # Localization files
│   │   ├── uz.json
│   │   ├── ru.json
│   │   └── index.js
│   ├── data/            # Mock data
│   │   └── mockPlaces.js
│   ├── utils/           # Utility functions
│   ├── services/        # API services
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── server/              # Backend server
│   ├── routes/          # API routes
│   │   ├── places.js
│   │   └── auth.js
│   ├── utils/           # Backend utilities
│   │   └── telegramAuth.js
│   ├── index.js         # Server entry point
│   ├── package.json
│   └── .env.example
└── package.json
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables if needed
4. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
3. Add environment variables (API keys)
4. Deploy

## 📱 Usage

1. Open the app and allow location access
2. Browse places by category or search
3. Click on cards to see details and get directions
4. Save favorites by clicking the heart icon
5. Use the map view to see all places at once
6. Try "Where should I go today?" for random suggestions
7. Log in with Telegram to sync favorites across devices

## 🌍 Supported Cities

The app currently supports major cities in Uzbekistan:
- Tashkent
- Samarkand
- Bukhara
- Fergana Valley (Fergana, Namangan, Andijan)
- Karshi
- Nukus
- Khiva
- And more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for Uzbekistan by Doniyor
