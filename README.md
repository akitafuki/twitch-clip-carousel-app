# Twitch Clip Carousel

A premium web application to play Twitch clips in an animated carousel format. Perfect as an AFK screen or as a live stream overlay for OBS Studio.

Built with **React**, **Vite 8**, **TypeScript 7.0**, and **Bootstrap**.

---

## ✨ Features

* 📺 **Autoplay Clip Carousel**: Seamlessly streams and cycles through top or random Twitch clips for any broadcaster.
* 📊 **Real-time Progress Tracker**: Smooth progress bar that matches the active duration of the playing clip.
* 🎥 **OBS Overlay Mode**: Chromeless, transparent layout specifically designed for OBS Studio Browser Sources.
* 🐳 **Docker Ready**: Containerized with Nginx for single-command production deployment.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20+ recommended)
* npm (v10+ recommended)

### Local Installation
1. Clone the repository and install dependencies:
   ```sh
   git clone https://github.com/your-username/twitch-clip-carousel.git
   cd twitch-clip-carousel
   npm install
   ```

2. Create a `.env` file in the root directory and add your Twitch API credentials:
   ```env
   VITE_TWITCH_CLIENT_ID=your_twitch_client_id
   VITE_TWITCH_CLIENT_SECRET=your_twitch_client_secret
   ```

3. Launch the local development server:
   ```sh
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Deployment

The application is containerized for simple deployment.

1. Configure your Twitch API credentials inside the `.env` file in the root directory.
2. Spin up the container:
   ```sh
   docker compose up --build -d
   ```
   The application will be served via Nginx on [http://localhost:3000](http://localhost:3000).

---

## 🎥 OBS Studio Overlay Setup

You can embed the carousel into OBS as a Browser Source to display clips transparently on stream. 

### 1. URL Query Configuration Parameters
Because the OBS CEF browser operates in an isolated environment, you configure preferences directly in the source URL:

| Parameter | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| **`channel`** | *string* (e.g. `shroud`) | *None* | **Required for direct load.** The broadcaster's Twitch username. |
| **`obs`** | `true` \| `false` | `false` | Hides player buttons and renders a thin 4px progress line at the bottom. |
| **`volume`** | `0` - `100` | `100` | Default player volume percentage. |
| **`type`** | `Top` \| `Random` | `Top` | Clip sorting algorithm. |
| **`period`** | `24h` \| `7d` \| `30d` \| `all` | `24h` | Range to retrieve clips from. |
| **`length`** | `short` \| `medium` \| `long` \| `any` | `any` | Duration filters (e.g. `short` limits to <30s). |

### 2. Add to OBS
1. Start the application (Docker or Dev server).
2. In OBS Studio, add a new **Browser Source** to your Scene.
3. Configure the **URL** (Example: Transparent overlay for Shroud):
   ```text
   http://localhost:3000/?channel=shroud&obs=true&volume=50
   ```
4. Adjust the **Width** and **Height** to match your stream dimensions (e.g. `1920` x `1080`).
5. Check **"Control audio via OBS"** if you want to control the sound inside the OBS audio mixer.
6. Click **OK**.