const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {

    console.log("Starting seed...")

    // =========================
    // 1 Create Asset Types
    // =========================
    const assetsData = [
        { code: "GOLD", name: "Gold Coins" },
        { code: "SILVER", name: "Silver Coins" },
        { code: "DIAMOND", name: "Diamonds" }
    ]

    const assets = {}

    for (const asset of assetsData) {
        const created = await prisma.assetType.upsert({
            where: { code: asset.code },
            update: {},
            create: asset
        })
        assets[asset.code] = created
    }

    // =========================
    // 2 Create Users
    // =========================
    const usersData = [
        { email: "bhaskar@indidino.com" },
        { email: "test@indidino.com" }
    ]

    const users = []

    for (const userData of usersData) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData
        })
        users.push(user)
    }

    // =========================
    // 3 Create Treasury Wallets
    // =========================
    for (const assetCode in assets) {
        await prisma.wallet.upsert({
            where: {
                // composite unique needed if you added it
                id: `treasury-${assetCode.toLowerCase()}`
            },
            update: {},
            create: {
                id: `treasury-${assetCode.toLowerCase()}`,
                userId: null,
                assetTypeId: assets[assetCode].id,
                name: `TREASURY_${assetCode}`,
                isSystem: true

            }
        })
    }

    // =========================
    // 4 Create Wallets for Users
    // =========================
    for (const user of users) {
        for (const assetCode in assets) {
            await prisma.wallet.upsert({
                where: {
                    userId_assetTypeId: {
                        userId: user.id,
                        assetTypeId: assets[assetCode].id
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    assetTypeId: assets[assetCode].id
                }
            })
        }
    }

    console.log("Seed completed successfully")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })