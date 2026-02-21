export default function ShopPanel({ user, onAction }) {
  const playSound = () => {
    const audio = new Audio("/click.mp3")
    audio.play()
  }

  async function handle(type, assetCode, amount) {
    playSound()

    await fetch(`/api/wallet/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify({
        userId: user.id,
        assetCode,
        amount
      })
    })

    onAction()
  }

  const topUpItems = [
    { id: 1, asset: "GOLD", amount: 100 },
    { id: 2, asset: "GOLD", amount: 500 },
    { id: 3, asset: "DIAMOND", amount: 50 }
  ]

  const spendItems = [
    { id: 4, name: "Sword", asset: "GOLD", amount: 50 },
    { id: 5, name: "Shield", asset: "GOLD", amount: 120 },
    { id: 6, name: "Dragon Egg", asset: "DIAMOND", amount: 40 }
  ]

  return (
    <div className="mt-12 max-w-6xl mx-auto px-6">

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        🛒 Shop
      </h2>

      {/* Top Up Section */}
      <div className="mb-10">
        <h3 className="text-lg mb-4 text-green-400">Top Up</h3>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {topUpItems.map(item => (
            <div
              key={item.id}
              className="min-w-[200px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:scale-105 transition"
            >
              <p className="text-yellow-400 font-semibold text-lg mb-2">
                {item.amount} {item.asset}
              </p>

              <button
                onClick={() => handle("topup", item.asset, item.amount)}
                className="w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Spend Section */}
      <div>
        <h3 className="text-lg mb-4 text-red-400">Spend</h3>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {spendItems.map(item => (
            <div
              key={item.id}
              className="min-w-[200px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:scale-105 transition"
            >
              <p className="text-yellow-400 font-semibold text-lg mb-2">
                {item.name}
              </p>

              <p className="text-sm text-zinc-400 mb-3">
                Cost: {item.amount} {item.asset}
              </p>

              <button
                onClick={() => handle("spend", item.asset, item.amount)}
                className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg"
              >
                Buy Item
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}