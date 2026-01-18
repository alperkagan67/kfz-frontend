# KFZ Handelsplattform - Frontend

React Frontend für die KFZ Handelsplattform.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **UI Library:** Material UI (MUI)
- **Routing:** React Router v6
- **Port:** 5173 (dev)

## Quick Start

```bash
# Repository klonen
git clone https://github.com/alperkagan67/kfz-frontend.git
cd kfz-frontend

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Frontend läuft auf: http://localhost:5173

## Scripts

| Command | Beschreibung |
|---------|--------------|
| `npm run dev` | Development Server starten |
| `npm run build` | Production Build erstellen |
| `npm run preview` | Production Build lokal testen |

## Projektstruktur

```
frontend/
├── src/
│   ├── components/     # Wiederverwendbare Komponenten
│   ├── pages/          # Seiten-Komponenten
│   ├── data/           # Mock-Daten
│   ├── utils/          # Hilfsfunktionen
│   ├── App.jsx         # Haupt-App mit Routing
│   ├── main.jsx        # Entry Point
│   └── theme.js        # MUI Theme Konfiguration
├── index.html
├── vite.config.js
└── package.json
```

## Seiten

| Route | Komponente | Beschreibung |
|-------|------------|--------------|
| `/` | Home | Startseite |
| `/vehicles` | VehicleList | Fahrzeugliste |
| `/sell` | SellVehicle | Fahrzeug verkaufen |
| `/admin` | AdminLogin | Admin Login |
| `/admin/dashboard` | AdminDashboard | Admin Bereich |

## Jira Board

Tickets: https://alperkagan.atlassian.net/browse/KAN

## Verwandte Repos

- **Backend:** https://github.com/alperkagan67/kfz-backend

## Backend Verbindung

Das Frontend erwartet das Backend auf `http://localhost:3000`.

```bash
# Terminal 1: Backend starten
cd ../backend && npm start

# Terminal 2: Frontend starten
cd ../frontend && npm run dev
```
