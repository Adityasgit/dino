import { useEffect, useState } from "react"

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const step = () => {
      start += Math.ceil((value - start) / 10)
      if (start < value) {
        setDisplay(start)
        requestAnimationFrame(step)
      } else {
        setDisplay(value)
      }
    }
    step()
  }, [value])

  return <span>{display}</span>
}

export default function ResourceBar({ resources }) {
  return (
    <div className="flex justify-center gap-6 mt-6">
      {resources.map((r) => (
        <div
          key={r.asset}
          className="bg-zinc-900 px-6 py-3 rounded-xl border border-zinc-700 shadow-lg flex items-center gap-3 transition hover:scale-105"
        >
          <span className="text-xl">{r.icon}</span>
          <span className="font-bold text-lg text-yellow-400">
            <AnimatedNumber value={r.balance} />
          </span>
        </div>
      ))}
    </div>
  )
}