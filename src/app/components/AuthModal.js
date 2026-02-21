"use client"
import { useState } from "react"

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [email, setEmail] = useState(mode === "login" ? "bhaskar@indidino.com" : "")

  async function handleSubmit() {
    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register"

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })

    const data = await res.json()
    if (res.ok) onSuccess(data.user || data)
        else alert(data.error || "An error occurred")
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-96">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">
          {mode === "login" ? "Login" : "Signup"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full bg-zinc-800 p-2 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-black py-2 rounded-lg"
        >
          Continue
        </button>

        <button onClick={onClose} className="mt-4 text-sm text-zinc-400">
          Cancel
        </button>
      </div>
    </div>
  )
}