import { useState } from 'react'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="glass-soft inline-flex flex-col gap-1 rounded-xl px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300">
      <li>Electron v{versions.electron}</li>
      <li>Chromium v{versions.chrome}</li>
      <li>Node v{versions.node}</li>
    </ul>
  )
}

export default Versions
