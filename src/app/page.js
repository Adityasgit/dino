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
  const [resources, setResources] = useState([])

  useEffect(() => {
    const stored = sessionStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [user])

  async function fetchTransactions() {
    const res = await fetch(
      user
        ? `/api/transaction/history?userId=${user.id}`
        : `/api/transaction/history`
    )
    const data = await res.json()
    setTransactions(data)
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
              <TransactionTabs transactions={transactions} />
            </div>

          </div>
        ) : (
          // Not logged in layout
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Welcome to DinoVault 🦖 - SYSTEM HISTORY
            </h2>
            <p className="text-zinc-400 mb-6">
              Please login or signup to view your transactions and access the shop.
            </p>
            
            <TransactionTabs transactions={transactions} />
          </div>
        )}
      </div>
    </>
  )
}