# Prelegal • 合意 (Gōi) — Mindful Agreement Atelier

<div align="center">

![Prelegal Banner](https://img.shields.io/badge/Prelegal-Mindful_Agreement_Atelier-1c1b18?style=for-the-badge&labelColor=f5f2eb&color=c85a38)
![Next.js 16](https://img.shields.io/badge/Next.js_16-React_19-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.12-009688?style=flat-square&logo=fastapi)
![Docker Compose](https://img.shields.io/badge/Docker-Compose_Ready-2496ED?style=flat-square&logo=docker)
![OpenRouter](https://img.shields.io/badge/AI_Engine-OpenRouter_Multi--Model-purple?style=flat-square)
![License](https://img.shields.io/badge/License-MIT_%26_CC_BY_4.0-31533d?style=flat-square)

<p align="center">
  <strong>An AI-powered conversational studio for drafting, refining, and sealing standard commercial contracts.</strong><br>
  Rooted in the serene <em>Japandi</em> aesthetic — blending Scandinavian warmth with Japanese <em>wabi-sabi</em> craftsmanship.
</p>

[Quickstart](#-quickstart) • [Architecture](#-architecture) • [Supported Agreements](#-supported-agreements-the-11-archives) • [Configuration](#-configuration) • [Testing](#-testing) • [License](#-license)

</div>

---

## 🌿 Overview

**Prelegal** reimagines contract drafting as a mindful, tranquil experience. Rather than filling out dense, intimidating legal forms, users engage in natural dialogue with **The Conversational Scribe**. The Scribe extracts parties, terms, governing law, and scope in real time, rendering them instantly onto a **Living Washi Paper Canvas** stamped with the traditional Japanese Hanko seal (`印`).

### Key Features

* 💬 **Conversational AI Scribe**: Powered by OpenRouter free-tier LLMs (`openai/gpt-oss-20b:free`) with an automatic 6-model fallback engine to withstand upstream rate limits.
* 📜 **The 11 CommonPaper Standard Archives**: Full support for all 11 standard agreements (Mutual NDA, Cloud Service, Pilot, AI Addendum, DPA, SLA, BAA, etc.).
* 🌾 **Japandi Design System**: Muted linen textures, sumi calligraphy ink, untreated white oak, terracotta persimmon accents, and zen garden progress tracking.
* ✍️ **3-in-1 Living Canvas**:
  * **Living Document**: Formatted legal contract with Hanko vermilion seals and signature blocks.
  * **Direct Terms Form**: Two-way interactive fields editor allowing direct adjustments.
  * **Washi Raw Markdown**: One-click clipboard copy of clean Markdown.
* 🖨️ **Client-Side PDF Generation**: High-fidelity PDF compilation with dynamic lazy loading via `@react-pdf/renderer`.
* 🔐 **Secure User Repository**: JWT cookie-based authentication with bcrypt password hashing and persistent named Docker volume storage.

---

## 🏛 Architecture

Prelegal is designed as a single-port containerized SaaS:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRELEGAL ATELIER                              │
├──────────────────────────┬──────────────────────────┬───────────────────┤
│    FRONT-END CLIENT      │     BACK-END SERVER      │    PERSISTENCE    │
│  (Next.js 16 + React 19) │        (FastAPI)         │ (SQLite + Volume) │
│                          │                          │                   │
│ • TypeScript             │ • Python 3.12 (uv)       │ • SQLite DB       │
│ • Tailwind CSS v4        │ • LiteLLM + OpenRouter   │ • Named Volume    │
│ • Cormorant Garamond     │ • SQLAlchemy ORM         │ • Docker Compose  │
│ • Plus Jakarta Sans      │ • JWT + Bcrypt Passwords │   (prelegal_data) │
│ • @react-pdf/renderer    │ • Pydantic v2 Models     │                   │
└──────────────────────────┴──────────────────────────┴───────────────────┘
```

The multi-stage Docker build compiles the Next.js static export (`frontend/out`) and serves it directly through FastAPI on **`http://localhost:8000`**.

---

## ⚡ Quickstart

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* An OpenRouter API Key (free models are supported).

### 1. Clone & Configure Environment
```bash
# Clone the repository
git clone https://github.com/your-username/prelegal.git
cd prelegal

# Create your environment file from template
cp .env.example .env
```

Edit `.env` and insert your OpenRouter API key:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=openrouter/openai/gpt-oss-20b:free
```

### 2. Launch with One Command

#### On Windows (PowerShell):
```powershell
.\scripts\start-windows.ps1
```

#### On macOS / Linux:
```bash
docker compose up --build -d
```

### 3. Open the Studio
Visit **[http://localhost:8000](http://localhost:8000)** in your browser.

To stop the container:
```powershell
.\scripts\stop-windows.ps1
# or: docker compose down
```

---

## 📦 Supported Agreements (The 11 Archives)

Prelegal integrates the open-source **Common Paper Standard Terms** (Version 1.0):

| Category | Agreement Name | Purpose |
| :--- | :--- | :--- |
| **Confidentiality** | **Mutual NDA (MNDA)** | Protect two-way confidential disclosures & evaluation ideas. |
| **Software & SaaS** | **Cloud Service Agreement (CSA)** | Standard SaaS vendor terms, SLA metrics, and billing cycles. |
| **Software & SaaS** | **Software License Agreement (SLA)** | On-premise binary licensing and usage boundaries. |
| **Services** | **Pilot Agreement** | 30/60/90-day product trial with $0 liability cap. |
| **Services** | **Design Partner Agreement** | Early-access beta feedback and co-development rights. |
| **Services** | **Professional Services Agreement (PSA)** | SOW statement-of-work consulting and milestone deliverables. |
| **Services** | **Partnership Agreement** | Co-marketing, reseller, and referral channel terms. |
| **Compliance & AI** | **AI Addendum** | Restrict customer data from being used to train public LLMs. |
| **Compliance & AI** | **Data Processing Agreement (DPA)** | GDPR / CCPA privacy, sub-processor, and audit clauses. |
| **Compliance & AI** | **Service Level Agreement (SLA)** | Uptime commitments, maintenance windows, and service credits. |
| **Compliance & AI** | **Business Associate Agreement (BAA)** | HIPAA compliance terms for Protected Health Information (PHI). |

---

## 🛠 Local Development (Without Docker)

If you wish to develop without Docker:

### Back-End (FastAPI)
```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

### Front-End (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Front-end dev server will run on `http://localhost:3000` and proxy API calls to port `8000`.

---

## 🧪 Testing

### Running Back-End Tests (Pytest)
```bash
# Inside running container:
docker compose exec -T prelegal uv run pytest tests

# Or locally in backend folder:
cd backend
uv run pytest tests
```
*Current test suite: **9/9 tests passing** covering authentication, document lifecycle CRUD, and health endpoints.*

### Running Front-End Tests (Jest)
```bash
cd frontend
npm test
```

---

## ⚙️ Configuration Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `OPENROUTER_API_KEY` | OpenRouter API Key for AI extraction. | `...` |
| `OPENROUTER_MODEL` | Primary model identifier. | `openrouter/openai/gpt-oss-20b:free` |
| `SECRET_KEY` | JWT token signature secret (64+ chars in prod). | `dev-secret-key-change-in-production` |
| `ENVIRONMENT` | Deployment mode (`development`, `production`). | `development` |
| `DATABASE_URL` | SQLAlchemy database connection URI. | `sqlite:///./data/prelegal.db` |
| `COOKIE_SECURE` | Set `true` to enforce HTTPS-only cookies. | `false` |

---

## 📄 License & Attributions

* **Application Code:** Licensed under the [MIT License]. Copyright © 2026 ashfin prem.
* **Legal Agreement Frameworks:** Standard contract terms are created by [Common Paper](https://commonpaper.com) and licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
