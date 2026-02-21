"use client"

export default function Header({ onLogin, onSignup, user }) {
  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-zinc-800">
      <h1 className="text-2xl font-bold tracking-widest text-yellow-400">
        DinoVault
      </h1>

      {!user ? (
        <div className="space-x-4">
          <button
            onClick={onLogin}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold"
          >
            Signup
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="text-sm text-zinc-400">
            {user.email}
          </div>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-sm rounded-lg" onClick={()=>{
                sessionStorage.clear()
                window.location.reload()
            }}>
              Logout
            </button>
        </div>
      )}
    </header>
  )
}