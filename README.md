# Xecutra

> AI-Powered Execution Agent for Individuals and Organizations built on Arc, Circle, and USDC.

**Vision:** Enable AI agents to safely execute autonomous financial workflows for individuals and organizations using programmable money on Arc.
 
Xecutra is an AI-powered execution agent that autonomously manages treasury, escrow, and payment workflows on Arc using USDC.

It enables **individuals and organizations** to define programmable spending rules and financial guardrails, allowing AI agents to securely approve transactions, manage wallets, lock funds in escrow, execute missions, and autonomously release payments.

The current MVP demonstrates this through an autonomous treasury workflow where an AI agent can:

- Plan missions
- Select vendors
- Enforce treasury guardrails
- Lock payments in escrow
- Verify delivery
- Release USDC on Arc
- Record every on-chain transaction

Xecutra demonstrates what an autonomous economic agent looks like when given a wallet, programmable money, and financial guardrails.

## The Problem

Financial workflows remain heavily dependent on manual approvals, whether for individuals managing personal finances or organizations overseeing treasury operations.

Tasks such as reviewing invoices, approving vendors, validating spending policies, confirming delivery, managing escrow, and executing payments often require multiple manual steps before funds can move.

As AI agents become capable of performing real work, they still struggle to complete financial workflows autonomously because they lack programmable financial infrastructure.

Without wallets, programmable money, guardrails, and secure payment controls, AI remains an assistant rather than an autonomous economic participant.

Xecutra addresses this by giving AI agents the ability to safely execute treasury and payment workflows within predefined financial rules while maintaining transparency and control.

## The Solution

Xecutra is an autonomous AI execution agent that combines AI decision-making with programmable money on Arc.

Individuals and organizations define financial guardrails such as spending limits, approved vendors, treasury reserves, and escrow requirements. Once these rules are in place, Xecutra can independently execute approved financial workflows while remaining within user-defined policies.

The current MVP demonstrates this through an autonomous treasury workflow for organizations.

A typical workflow looks like this:

1. An organization creates a mission.
2. The AI evaluates the request and selects the best vendor.
3. Guardrails validate that the mission complies with treasury policies.
4. Funds are locked in escrow.
5. Delivery is confirmed.
6. Xecutra releases USDC to the vendor on Arc.
7. Every payment is recorded for transparency and auditing.

This demonstrates how programmable money enables AI agents to move beyond recommendations and autonomously execute complete financial workflows within predefined guardrails.

## Key Features

- 🤖 **AI Mission Planning**
  - Evaluates missions and selects the most suitable vendor.

- 🛡️ **Programmable Guardrails**
  - Enforces spending limits, treasury reserves, approved vendors, and escrow requirements before funds can move.

- 🔒 **Automated Escrow**
  - Locks mission funds until delivery has been confirmed.

- 💵 **USDC Payments on Arc**
  - Releases USDC directly to vendors using Circle Developer-Controlled Wallets on Arc.

- 📜 **Transaction Tracking**
  - Records every payment with Circle transaction IDs, blockchain transaction hashes, and payment status.

- 🏢 **Treasury Management**
  - Manages wallets, treasury balances, and programmable financial controls for individuals and organizations.

- ⚡ **End-to-End Autonomous Workflow**
  - Mission → AI Decision → Guardrails → Escrow → Delivery → Payment → Transaction Record.

## Architecture

```text
                    Organization
                          │
                          ▼
                  Create Mission
                          │
                          ▼
                  Xecutra AI Agent
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     Select Vendor   Check Guardrails   Verify Treasury
          │               │               │
          └───────────────┴───────────────┘
                          │
                          ▼
                   Lock Funds in Escrow
                          │
                          ▼
                  Delivery Confirmation
                          │
                          ▼
                 Release USDC via Circle
                          │
                          ▼
                    Arc Blockchain
                          │
                          ▼
                Transaction Recorded
```

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Prisma ORM

### Blockchain & Payments
- Arc Testnet
- Circle Developer-Controlled Wallets
- USDC

### AI
- Rule-based AI Planner (current MVP)
- Programmable Guardrails Engine

### Version Control
- Git
- GitHub

## Demo Flow
The current MVP demonstrates a complete autonomous treasury workflow for organizations. Future versions will extend the same autonomous execution model to individual users.

### 1. Organization Dashboard

An organization views its treasury balance, financial guardrails, and existing missions.

↓

### 2. Create Mission

The organization submits a mission with:

- Title
- Description
- Estimated Cost
- Deadline

↓

### 3. AI Decision

Xecutra automatically:

- Selects the best vendor
- Calculates the proposed payment
- Verifies the mission satisfies treasury guardrails

↓

### 4. Escrow

If approved:

- Funds are reserved
- Escrow is created
- The mission enters the execution stage

↓

### 5. Delivery Confirmation

The organization confirms that the vendor completed the work.

↓

### 6. Autonomous Payment

Xecutra automatically:

- Releases USDC
- Executes the transfer through Circle
- Sends funds on Arc

↓

### 7. Transaction Record

The payment is stored together with:

- Circle Transaction ID
- Blockchain Transaction Hash
- Transaction Status
- Amount
- Vendor

## Why Arc?

Xecutra was designed specifically for the **Agentic Economy Track** on Arc.

The project demonstrates how AI agents can autonomously execute real financial workflows using programmable money, escrow, and treasury guardrails on Arc.

Arc enables Xecutra to:

- Execute real USDC payments on-chain.
- Allow AI agents to control treasury operations through developer-controlled wallets.
- Secure payments using programmable escrow workflows.
- Build trust through transparent, verifiable blockchain transactions.
- Move from AI-assisted workflows to fully autonomous financial execution.

Instead of simply generating recommendations, Xecutra demonstrates how AI agents can autonomously plan, validate, secure, and execute complete financial workflows while remaining within predefined treasury policies.

## Roadmap

### Current MVP

- ✅ Organization treasury management
- ✅ AI mission planning
- ✅ Programmable guardrails
- ✅ Escrow creation
- ✅ Delivery confirmation
- ✅ USDC payment execution on Arc
- ✅ Circle transaction recording
- ✅ React dashboard

### Next Milestones

- 🔄 Live transaction status synchronization
- 📊 Treasury analytics dashboard
- 🤖 LLM-powered vendor selection
- 📈 Treasury forecasting and budgeting
- 👥 Multi-user and multi-organization support
- 🔐 Multi-signature approval policies
- 📱 Notifications and alerts
- 🌐 Production deployment

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Lummy01/Xecutra.git
cd Xecutra
```

### Install backend dependencies

```bash
npm install
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

### Configure environment variables

Create a `.env` file in the project root with the required Circle and database credentials.

Example:

```env
DATABASE_URL=your_database_url

CIRCLE_API_KEY=your_circle_api_key
CIRCLE_ENTITY_SECRET=your_entity_secret
```

### Run the backend

```bash
node index.js
```

### Run the frontend

Open another terminal.

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5175 (or another available Vite port)
- Backend API: http://localhost:3000

## License

This project was developed for the Arc Hackathon as a demonstration of autonomous treasury management using AI, programmable money, Circle Developer-Controlled Wallets, and USDC on Arc.

MIT License.
