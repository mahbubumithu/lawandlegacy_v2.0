# Law & Legacy — Premier Advocacy & Legal Chambers

A distinguished, high-performance web platform for **Law & Legacy**, a premier advocacy firm in Bangladesh.

Featuring an **Ultra-Sleek Glassmorphic Design System**, polished legal chamber typography, self-contained local data persistence, and complete **Docker local containerization**.

---

## ✨ Firm Capabilities & Features

- **Glassmorphism Design System**: Radiant frosted glass panels, ambient mesh backdrops, interactive hover sheen cards, and a Dark/Light crystal glass theme toggle.
- **Rearranged Practice-First Layout**: Immediate exposure of 12 core practice areas, chamber leadership ethos, advocate credentials, and corporate client enlistments.
- **Confidential Consultation Intake**: Integrated direct consultation booking on the landing page with instant case docket reference generation.
- **Chamber Portal (`/admin`)**: Content management console to update practice areas, team profiles, legal notices, and chamber dispatches.
- **Local Persistence & Deployment**: Self-contained local deployment with Docker containerization and persistent data volume.

---

## 🚀 Running in Docker (Local)

The application is pre-configured with multi-stage Docker builds and persistent volume storage.

### 1. Start the Container
```bash
docker compose up -d --build
```
The application will build and run on **http://localhost:3000**.

### 2. Check Container Health & Status
```bash
docker ps --filter "name=lawandlegacy-app"
docker logs -f lawandlegacy-app
```

### 3. Stop the Container
```bash
docker compose down
```

---

## 🛠️ Local Development (Without Docker)

You can also run locally with Node.js:

```bash
# 1. Install dependencies
npm install

# 2. Run the chamber backend server (Port 3000)
npm run server

# 3. In another terminal, run the Vite development server (Port 5173)
npm run dev
```

---

## 🔐 Credentials & Ports

| Service | Address | Access |
|---|---|---|
| **Chamber Web Platform** | `http://localhost:3000` | Public Access |
| **Chamber Portal** | `http://localhost:3000/admin` | Passcode: `admin123` |
| **System Healthcheck** | `http://localhost:3000/api/health` | Public Access |
