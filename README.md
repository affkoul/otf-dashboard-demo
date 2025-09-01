## Lorenzo OTF Dashboard (Demo)

This project is a React + TypeScript + Vite front-end demo for exploring Lorenzo Protocol OTF (On-chain Traded Fund) vaults.

It connects to the Lorenzo REST APIs (/lorenzo/v1/simplevault/list, /lorenzo/v1/vault/summary, etc.) to show live vault data, with wallet integration (via Wagmi/Ethers.js) and persistent state (via Redux Toolkit + redux-persist).

![Dashboard Screenshot](https://raw.githubusercontent.com/affkoul/otf-dashboard-demo/main/public/dashboard-image.png)

## ✨ Features

📊 Vault Selector — dropdown to browse and pick from available OTF vaults

💹 Vault Stats — displays Unit NAV, 7D APY, symbol, and more

👥 User & TVL info — pulls data from Lorenzo’s APIs

🔄 State persistence — remembers last selected vault between sessions

🔗 Wallet integration — ready for Wagmi hooks (MetaMask, WalletConnect, etc.)

📡 Future support — placeholder for WebSocket probe to test real-time updates

## 🏗️ Tech Stack

- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev) — fast build + dev server
- [Redux Toolkit](https://redux-toolkit.js.org)
- [redux-persist](https://github.com/rt2zz/redux-persist)
- [Wagmi](https://wagmi.sh/)
- [Ethers.js](https://docs.ethers.org)
- [Recharts](https://recharts.org) (ready for chart visualizations)
- [Tailwind CSS](https://tailwindcss.com)

## 🚀 Getting Started
1. Clone repo
```js
git clone https://github.com/affkoul/otf-dashboard-demo.git
cd otf-dashboard-demo
```

2. Install dependencies
```js
yarn install
```

3. Configure environment

Copy .env.example → .env and set API base URLs:
```js
VITE_API_BASE=https://otf.lorenzo-protocol.xyz/lorenzo/v1
VITE_PRICE_API=https://lorenzo-api.lorenzo-protocol.xyz/api
VITE_TARGET_VAULT=0x4F2760B32720F013E900DC92F65480137391199b
```

4. Run dev server
```js
yarn dev
```

App runs at [http://localhost:5173](http://localhost:5173)

## 📂 Project Structure
```js
src/
 ├── app/             # Redux store & persistence
 ├── components/      # UI components (StatCards, VaultChart, etc.)
 ├── features/        # Redux slices (performance, wallet)
 ├── lib/             # API clients & utils
 ├── pages/           # VaultPage (main dashboard view)
 ├── main.tsx         # App entrypoint
 └── index.css        # Tailwind + base styles
 ```

## 📊 Demo Functionality

StatCards: show Unit NAV, 7D APY, Symbol

VaultPage: lets user select a vault and fetch data from API

Overview: placeholder for more charts / metrics

WS Probe: developer tool for testing possible WebSocket endpoints

## 🔮 Next Steps

Add charts for historical performance

Show portfolio composition per vault

Enable real wallet interactions (deposit/withdraw simulation)

Deploy demo to Vercel/Netlify for live preview

## 📝 License

This demo is for evaluation purposes only.
Not financial advice — do not use for live trading without auditing.