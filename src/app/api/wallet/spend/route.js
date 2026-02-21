import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req) {
  try {
    const { userId, assetCode, amount, idempotencyKey } = await req.json()

    if (!userId || !assetCode || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {

      // 1 Idempotency check
      if (idempotencyKey) {
        const existing = await tx.transaction.findUnique({
          where: { idempotencyKey }
        })
        if (existing) {
          return { message: "Already processed" }
        }
      }

      // 2 Get asset
      const asset = await tx.assetType.findUnique({
        where: { code: assetCode }
      })
      if (!asset) throw new Error("Asset not found")

      // 3 Lock user wallet row
      const userWallet = await tx.$queryRawUnsafe(`
        SELECT * FROM "Wallet"
        WHERE "userId" = '${userId}'
        AND "assetTypeId" = '${asset.id}'
        FOR UPDATE
      `)

      if (!userWallet.length) throw new Error("User wallet not found")

      const walletId = userWallet[0].id

      // 4 Calculate balance inside transaction
      const credits = await tx.ledgerEntry.aggregate({
        where: {
          walletId,
          entryType: "CREDIT"
        },
        _sum: { amount: true }
      })

      const debits = await tx.ledgerEntry.aggregate({
        where: {
          walletId,
          entryType: "DEBIT"
        },
        _sum: { amount: true }
      })

      const balance =
        (credits._sum.amount || 0) -
        (debits._sum.amount || 0)

      if (balance < amount) {
        throw new Error("Insufficient balance")
      }

      // 5 Get treasury wallet
      const treasuryWallet = await tx.wallet.findFirst({
        where: {
          assetTypeId: asset.id,
          userId: null
        }
      })

      if (!treasuryWallet) throw new Error("Treasury wallet not found")

      // 6 Create transaction
      const transaction = await tx.transaction.create({
        data: {
          idempotencyKey,
          type: "SPEND"
        }
      })

      // 7 Double-entry ledger
      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: transaction.id,
            walletId: walletId,
            amount,
            entryType: "DEBIT"
          },
          {
            transactionId: transaction.id,
            walletId: treasuryWallet.id,
            amount,
            entryType: "CREDIT"
          }
        ]
      })

      return { message: "Spend successful" }
    })

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}