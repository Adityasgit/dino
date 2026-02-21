const prisma = require("@/lib/prisma")

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {

      const user = await tx.user.create({
        data: { email }
      })

      const assets = await tx.assetType.findMany()

      const wallets = await Promise.all(
        assets.map(asset =>
          tx.wallet.create({
            data: {
              userId: user.id,
              assetTypeId: asset.id
            }
          })
        )
      )

      return { user, wallets }
    })

    return Response.json(result)

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
}