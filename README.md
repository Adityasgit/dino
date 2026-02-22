# DinoVault -- Ledger-Based Virtual Asset Wallet

## 🚀 Overview

DinoVault is a ledger-based multi-asset wallet system built using:

-   **Next.js (App Router)**
-   **Prisma ORM**
-   **PostgreSQL**
-   **Docker & Docker Compose**

The system implements:

-   Double-entry accounting
-   Concurrency-safe spend logic
-   Idempotent financial operations
-   Treasury system wallet
-   Multi-asset support (GOLD, SILVER, DIAMOND)
-   Dockerized deployment

In addition to backend APIs, a **basic UI** has been
implemented to:

-   Register / Login users
-   View balances per asset
-   View transaction history
-   Perform Top-up and Spend actions
-   Visually test and interact with all APIs

This UI is intended to demonstrate API functionality and system
behavior.

------------------------------------------------------------------------

## 🐳 Running the Application (Recommended)

The application is fully containerized.

The Next.js application image is already uploaded to Docker Hub:

`adityasdockership/dino-app`

### Step 1 -- Clone the Repository

``` bash
git clone https://github.com/Adityasgit/dino
cd dino
```

### Step 2 -- Start Using Docker Compose

``` bash
docker compose up
```

This will:

-   Start PostgreSQL container
-   Pull the Next.js app image from Docker Hub
-   Connect the app to the database
-   Automatically run Prisma migrations
-   Start the application server

### 🌐 Access the Application

Open in your browser:

http://localhost:3000

------------------------------------------------------------------------

## 🌱 Database Seeding (First Time Only)

If running for the first time, seed the database:

``` bash
docker exec -it dino_app npx prisma db seed
```

Seed only needs to be run once.

------------------------------------------------------------------------

## 🏗 Architecture Highlights

-   Ledger-based accounting (no balance column)
-   ACID-compliant transactions
-   Row-level locking (SELECT ... FOR UPDATE)
-   Idempotent financial operations
-   Multi-asset scalable design
-   Dockerized deployment
