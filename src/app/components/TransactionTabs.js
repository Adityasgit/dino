import { useState } from "react"

export default function TransactionTabs({ transactions, loading, system = false }) {
    const [filter, setFilter] = useState("ALL")

    const filtered =
        filter === "ALL"
            ? transactions
            : transactions.filter(t => t.asset === filter)


    const total_credits = filtered.reduce((sum, tx) => {
        if (tx.entryType === "CREDIT") {
            return sum + tx.amount
        }
        return sum
    }, 0)

    const total_debits = filtered.reduce((sum, tx) => {
        if (tx.entryType === "DEBIT") {
            return sum + tx.amount
        }
        return sum
    }, 0)


    const totalDebit = system ? total_credits : total_debits
    const totalCredit = system ? total_debits : total_credits

    return (
        <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex gap-4 mb-4">
                {["ALL", "GOLD", "SILVER", "DIAMOND"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg ${filter === tab
                            ? "bg-yellow-500 text-black"
                            : "bg-zinc-800"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {
                filtered.length > 0 && (
                    <p className="text-sm text-zinc-500 mb-4">
                        Showing {filtered.length} transaction{filtered.length > 1 ? "s" : ""}.
                    </p>
                )
            }

            {/* header  */}
            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 mb-2 flex justify-between">
                <div>
                    <p className="text-sm text-zinc-400">Type</p>
                    <p className="font-semibold text-yellow-400">Asset</p>
                </div>
                <div className="flex gap-8 min-w-[150px] justify-center">
                     <div className="text-sm text-zinc-400">
                        Total <br />
                        {totalCredit-totalDebit > 0 && (
                            <span className="text-green-400 font-semibold">
                                +{totalCredit-totalDebit}
                            </span>
                        )}
                        {totalDebit-totalCredit > 0 && (
                            <span className="text-red-400 font-semibold">
                                -{totalDebit-totalCredit}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-zinc-400">
                        Debit <br />
                        {totalDebit > 0 && (
                            <span className="text-red-400 font-semibold">
                                -{totalDebit}
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-zinc-400">
                        Credit <br />
                        {totalCredit > 0 && (
                            <span className="text-green-400 font-semibold">
                                +{totalCredit}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {filtered.map(tx => {
                // Determine how to show based on perspective
                const isCredit = tx.entryType === "CREDIT"
                const isDebit = tx.entryType === "DEBIT"

                // If system view, flip logic
                const debitValue = system
                    ? (isCredit ? tx.amount : null)
                    : (isDebit ? tx.amount : null)

                const creditValue = system
                    ? (isDebit ? tx.amount : null)
                    : (isCredit ? tx.amount : null)


                return (
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

                        <div className="flex gap-8 min-w-[150px] justify-end">
                            {/* Debit Column */}
                            <div className="w-16 text-right">
                                {debitValue && (
                                    <span className="text-red-400 font-semibold">
                                        -{debitValue}
                                    </span>
                                )}
                            </div>

                            {/* Credit Column */}
                            <div className="w-16 text-right">
                                {creditValue && (
                                    <span className="text-green-400 font-semibold">
                                        +{creditValue}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
            {
                filtered.length === 0 && (
                    <p className="text-center text-zinc-500 mt-10">
                        {loading ? "Loading transactions..." : "No transactions found."}
                    </p>
                )
            }
        </div>
    )
}