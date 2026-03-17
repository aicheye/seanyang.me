'use client'

import { useState } from 'react'

export function SSHCopyButton() {
  const [copied, setCopied] = useState(false)

  function copySSH() {
    navigator.clipboard.writeText('ssh seanyang.me')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="ssh-hint">
      prefer a terminal?
      <button className="ssh-copy" onClick={copySSH}>
        <code>$ ssh seanyang.me</code>
        <span className="ssh-copy-label">{copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        )}</span>
      </button>
    </div>
  )
}
