import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get("userId")
    const assetCode = searchParams.get("assetCode")

    // 1 Optional asset filter
    let assetId;

    if (assetCode) {
      const asset = await prisma.assetType.findUnique({
        where: { code: assetCode }
      })
      if (!asset) {
        return NextResponse.json(
          { error: "Asset not found" },
          { status: 400 }
        )
      }
      assetId = asset.id
    }

    // 2 Get wallets
    let wallets

    if (userId) {
      // user-specific wallets
      wallets = await prisma.wallet.findMany({
        where: {
          userId,
          ...(assetId ? { assetTypeId: assetId } : {})
        },
        include: { assetType: true }
      })
    } else {
      // all non-system wallets
      wallets = await prisma.wallet.findMany({
        where: {
          userId: { not: null },
          ...(assetId ? { assetTypeId: assetId } : {})
        },
        include: { assetType: true }
      })
    }

    const walletIds = wallets.map(w => w.id)

    if (!walletIds.length) {
      return NextResponse.json([])
    }

    // 3 Fetch ledger entries
    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where: {
        walletId: { in: walletIds }
      },
      include: {
        transaction: true,
        wallet: {
          include: {
            assetType: true,
            user: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // 4 Format response
    const formatted = ledgerEntries.map(entry => ({
      transactionId: entry.transactionId,
      type: entry.transaction.type,
      userId: entry.wallet.userId,
      email: entry.wallet.user?.email,
      asset: entry.wallet.assetType.code,
      entryType: entry.entryType,
      amount: entry.amount,
      createdAt: entry.createdAt
    }))

    return NextResponse.json(formatted)

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}