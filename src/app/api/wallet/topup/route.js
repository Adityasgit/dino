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
        const existingTx = await tx.transaction.findUnique({
          where: { idempotencyKey }
        })

        if (existingTx) {
          return { message: "Already processed" }
        }
      }

      // 2 Get asset
      const asset = await tx.assetType.findUnique({
        where: { code: assetCode }
      })

      if (!asset) throw new Error("Asset not found")

      // 3 Get user wallet
      const userWallet = await tx.wallet.findUnique({
        where: {
          userId_assetTypeId: {
            userId,
            assetTypeId: asset.id
          }
        }
      })

      if (!userWallet) throw new Error("User wallet not found")

      // 4 Get treasury wallet
      const treasuryWallet = await tx.wallet.findFirst({
        where: {
          assetTypeId: asset.id,
          isSystem: true
        }
      })

      if (!treasuryWallet) throw new Error("Treasury wallet not found")

      // 5 Create transaction
      const transaction = await tx.transaction.create({
        data: {
          idempotencyKey,
          type: "TOP_UP"
        }
      })

      // 6 Create ledger entries (double entry)
      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: transaction.id,
            walletId: treasuryWallet.id,
            amount,
            entryType: "DEBIT"
          },
          {
            transactionId: transaction.id,
            walletId: userWallet.id,
            amount,
            entryType: "CREDIT"
          }
        ]
      })

      return { message: "Top-up successful" }
    })

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}