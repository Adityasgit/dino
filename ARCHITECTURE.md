# DinoVault -- System Architecture

## 1. High-Level Architecture

Client (Browser UI) ↓ Next.js API Routes ↓ Business Logic Layer ↓ Prisma
ORM ↓ PostgreSQL Database

------------------------------------------------------------------------

## 2. Core Design Principle -- Ledger-Based Accounting

The system does NOT store balances directly in the wallet table.

Balance is computed as:

SUM(CREDIT) - SUM(DEBIT)

Total system balance always equals zero.

------------------------------------------------------------------------

## 3. Database Schema

### User

-   id (UUID, Primary Key)
-   email (Unique)
-   createdAt

### AssetType

-   id (UUID, Primary Key)
-   code (Unique)
-   name
-   createdAt

### Wallet

-   id (UUID, Primary Key)
-   userId (Nullable for treasury)
-   assetTypeId
-   createdAt
-   Unique (userId, assetTypeId)

Treasury wallet is represented by userId = NULL.

### Transaction

-   id (UUID, Primary Key)
-   idempotencyKey (Unique)
-   type (TOP_UP, SPEND, BONUS, TRANSFER)
-   createdAt

### LedgerEntry

-   id (UUID, Primary Key)
-   transactionId
-   walletId
-   amount
-   entryType (DEBIT / CREDIT)
-   createdAt

------------------------------------------------------------------------

## 4. Concurrency Control

Spend operation uses:

-   prisma.\$transaction()
-   SELECT ... FOR UPDATE
-   Balance calculation inside locked transaction

Prevents:

-   Race conditions
-   Double spend
-   Negative balances

------------------------------------------------------------------------

## 5. Idempotency

Each financial request supports an Idempotency-Key.

Duplicate requests do not create duplicate transactions.

------------------------------------------------------------------------

## 6. Deployment

Docker Compose runs:

-   PostgreSQL container
-   Application container

Migrations are applied using:

npx prisma migrate deploy
