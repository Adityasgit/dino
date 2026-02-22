# DinoVault -- API Documentation

## Base URL

When running locally:

http://localhost:3000

------------------------------------------------------------------------

# Authentication APIs

## Register User

POST /api/auth/register

Body: { "email": "user@example.com" }

Response: { "user": { ... }, "wallets": \[ ... \] }

------------------------------------------------------------------------

## Login User

POST /api/auth/login

Body: { "email": "user@example.com" }

Response: { "id": "...", "email": "...", "wallets": \[ { "walletId":
"...", "asset": "GOLD", "balance": 100 } \] }

------------------------------------------------------------------------

# Wallet APIs

## Top Up

POST /api/wallet/topup

Headers: Idempotency-Key: `<unique-key>`{=html}

Body: { "userId": "...", "assetCode": "GOLD", "amount": 100 }

Behavior: - Debits treasury wallet - Credits user wallet - Creates
transaction + ledger entries

------------------------------------------------------------------------

## Spend

POST /api/wallet/spend

Headers: Idempotency-Key: `<unique-key>`{=html}

Body: { "userId": "...", "assetCode": "GOLD", "amount": 50 }

Behavior: - Locks wallet row (FOR UPDATE) - Validates balance - Debits
user wallet - Credits treasury wallet - Creates transaction + ledger
entries

------------------------------------------------------------------------

# Transaction APIs

## Get Transaction History

GET
/api/transaction/history?userId=`<id>`{=html}&assetCode=`<optional>`{=html}

Query Params: - userId (optional) - assetCode (optional)

Response: \[ { "transactionId": "...", "type": "TOP_UP", "asset":
"GOLD", "entryType": "CREDIT", "amount": 100, "createdAt": "..." }\]

If no userId is provided: - Returns all user transactions

------------------------------------------------------------------------

# Idempotency

All financial operations support:

Idempotency-Key header

If the same key is reused: - The existing transaction is returned - No
duplicate ledger entries are created

------------------------------------------------------------------------

# Concurrency Control

Spend endpoint uses:

-   Database transactions
-   Row-level locking (SELECT ... FOR UPDATE)
-   Balance validation inside locked transaction

Prevents double-spend and race conditions.
