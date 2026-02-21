"use client"

import { useEffect, useState } from "react"
import Header from "./components/Header"
import AuthModal from "./components/AuthModal"
import ResourceBar from "./components/ResourceBar"
import TransactionTabs from "./components/TransactionTabs"
import ShopPanel from "./components/ShopPanel"

export default function Home() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [resources, setResources] = useState([])

  useEffect(() => {
    const stored = sessionStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [user])

  async function fetchTransactions() {
    setTransactionsLoading(true)
    const res = await fetch(
      user
        ? `/api/transaction/history?userId=${user.id}`
        : `/api/transaction/history`
    )
    const data = await res.json()
    setTransactions(data)
    setTransactionsLoading(false)
  }

  async function fetchUser() {
    if (!user) return
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: user.email })
    })
    const data = await res.json()
    setResources(
      data.wallets.map(w => ({
        asset: w.asset.code,
        balance: w.balance,
        icon:
          w.asset.code === "GOLD"
            ? "🪙"
            : w.asset.code === "SILVER"
              ? "🥈"
              : "💎"
      }))
    )
  }

  useEffect(() => {
    if (user) fetchUser()
  }, [user])

  return (
    <>
      <Header
        user={user}
        onLogin={() => setShowAuth("login")}
        onSignup={() => setShowAuth("signup")}
      />

      {showAuth && (
        <AuthModal
          mode={showAuth}
          onClose={() => setShowAuth(null)}
          onSuccess={(u) => {
            sessionStorage.setItem("user", JSON.stringify(u))
            setUser(u)
            setShowAuth(null)
          }}
        />
      )}

      {/* Resource Bar */}
      {user && <ResourceBar resources={resources} />}
      {
        !user && (
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 max-w-7xl mx-auto mt-6">
            <p className="text-center text-zinc-400">
              Please login to view your resources and transactions.
            </p>
          </div>
        )
      }

      <div className="mt-10 px-6">
        {user ? (
          // Logged in layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            {/* Left - Shop */}
            <div className="lg:col-span-1">
              <ShopPanel
                user={user}
                onAction={() => {
                  fetchTransactions()
                  fetchUser()
                }}
              />
            </div>

            {/* Right - Transactions */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Transactions</h2>
              <TransactionTabs system={false} transactions={transactions} loading={transactionsLoading} />
            </div>

          </div>
        ) : (
          // Not logged in layout
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Welcome to DinoVault 🦖 - SYSTEM HISTORY
            </h2>            

            <TransactionTabs system={true} transactions={transactions} loading={transactionsLoading} />
          </div>
        )}
      </div>
    </>
  )
}