const prisma = require("@/lib/prisma")

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email required" }),
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallets: {
          include: {
            assetType: true
          }
        }
      }
    })

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      )
    }

    const walletsWithBalance = await Promise.all(
      user.wallets.map(async (wallet) => {

        const credits = await prisma.ledgerEntry.aggregate({
          where: {
            walletId: wallet.id,
            entryType: "CREDIT"
          },
          _sum: { amount: true }
        })

        const debits = await prisma.ledgerEntry.aggregate({
          where: {
            walletId: wallet.id,
            entryType: "DEBIT"
          },
          _sum: { amount: true }
        })

        const balance =
          (credits._sum.amount || 0) -
          (debits._sum.amount || 0)

        return {
          walletId: wallet.id,
          asset: {
            id: wallet.assetType.id,
            code: wallet.assetType.code,
            name: wallet.assetType.name
          },
          balance
        }
      })
    )

    return Response.json({
      id: user.id,
      email: user.email,
      wallets: walletsWithBalance
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
}