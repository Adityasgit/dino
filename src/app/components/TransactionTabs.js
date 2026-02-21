import { useState } from "react"

export default function TransactionTabs({ transactions }) {
  const [filter, setFilter] = useState("ALL")

  const filtered =
    filter === "ALL"
      ? transactions
      : transactions.filter(t => t.asset === filter)

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="flex gap-4 mb-4">
        {["ALL", "GOLD", "SILVER", "DIAMOND"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg ${
              filter === tab
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.map(tx => (
        <div
          key={tx.transactionId}
          className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-3 flex justify-between"
        >
          <div>
            <p className="text-sm text-zinc-400">{tx.type}</p>
            <p className="font-semibold text-yellow-400">
              {tx.asset}
            </p>
          </div>
          <div className={tx.entryType === "CREDIT" ? "text-green-400" : "text-red-400"}>
            {tx.entryType === "CREDIT" ? "+" : "-"}{tx.amount}
          </div>
        </div>
      ))}
      {
        filtered.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">
            No transactions found.
          </p>
        )
      }
    </div>
  )
}