"use client"

import { useEffect, useState } from "react"
import { PrivyProvider, useLogin, usePrivy } from "@privy-io/react-auth"

async function exchangeSession(path: string, body?: object) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || "Sign-in failed. Please try again.")
  window.location.assign("/app")
}

function LoginOptions() {
  const { ready, authenticated, getAccessToken, logout } = usePrivy()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function enterApp() {
    setBusy(true)
    setError("")
    try {
      const token = await getAccessToken()
      if (!token) throw new Error("Your sign-in expired. Please sign in again.")
      await exchangeSession("/api/auth/privy/verify", { access_token: token })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed")
      setBusy(false)
    }
  }

  const { login } = useLogin({
    onComplete: () => { void enterApp() },
    onError: () => setError("Sign-in could not be completed. Please try again."),
  })

  return <>
    <button className="portal-primary" disabled={!ready || busy} onClick={() => authenticated ? enterApp() : login({ loginMethods: ["google"] })}>
      {busy ? "Entering…" : authenticated ? "Enter app" : "Continue with Google"}
    </button>
    {authenticated && <button className="portal-secondary" disabled={busy} onClick={() => logout()}>Use another Google account</button>}
    {authenticated && <p className="portal-note">Signed in securely. Continue to enter the app.</p>}
    {error && <p role="alert" className="portal-error">{error}</p>}
  </>
}

export default function Portal() {
  const [appId, setAppId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [demoBusy, setDemoBusy] = useState(false)
  const [nearReady, setNearReady] = useState(false)
  const [nearBusy, setNearBusy] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "/static/near.js"
    script.async = true
    script.onload = () => setNearReady(true)
    script.onerror = () => setError("NEAR wallet sign-in could not be loaded. Please refresh and retry.")
    document.body.appendChild(script)
    fetch("/api/auth/privy/config").then(response => {
      if (!response.ok) throw new Error("Unable to load sign-in configuration")
      return response.json()
    }).then(data => setAppId(data.app_id)).catch(() => setError("Sign-in is temporarily unavailable. Please retry.")).finally(() => setLoading(false))
    return () => { script.remove() }
  }, [])

  async function enterDemo() {
    setDemoBusy(true)
    setError("")
    try { await exchangeSession("/api/auth/demo") }
    catch { setError("Could not start demo mode. Please try again."); setDemoBusy(false) }
  }

  async function connectNear() {
    setNearBusy(true)
    setError("")
    try {
      const connector = (window as Window & { connectNearWallet?: () => Promise<void> }).connectNearWallet
      if (!connector) throw new Error("NEAR wallet sign-in is still loading. Please try again.")
      await connector()
    } catch (err) {
      setError(err instanceof Error ? err.message : "NEAR wallet sign-in failed")
    } finally {
      setNearBusy(false)
    }
  }

  return <main className="portal-shell">
    <style>{`
      .portal-shell{min-height:100vh;background:#f7f7f4;display:grid;place-items:center;padding:32px 20px;color:#171717;font-family:system-ui,sans-serif}
      .portal-card{width:100%;max-width:480px;background:white;border:1px solid #e3e3df;border-radius:24px;padding:40px;box-shadow:0 20px 60px #00000006}
      .portal-brand{font-size:13px;letter-spacing:.18em;text-decoration:none;color:inherit}.portal-label{font-size:11px;letter-spacing:.18em;color:#777;margin:42px 0 12px}
      .portal-card h1{font-size:34px;letter-spacing:-.04em;margin:0 0 14px}.portal-copy{color:#666;line-height:1.65;font-size:14px;margin-bottom:28px}
      .portal-primary,.portal-secondary{width:100%;border-radius:12px;padding:15px 18px;cursor:pointer;font-size:14px;font-weight:600;transition:background .2s}
      .portal-primary{background:#171717;color:white;border:1px solid #171717}.portal-primary:hover{background:#333}.portal-secondary{background:white;border:1px solid #ddd;margin-top:12px;color:#171717}
      .portal-card button:disabled{opacity:.5;cursor:wait}.portal-note{font-size:12px;color:#777;line-height:1.7;margin-top:14px}.portal-divider{border-top:1px solid #eee;margin:28px 0 20px}.portal-error{color:#b42318;font-size:13px;line-height:1.5}
      .portal-footer{display:flex;justify-content:space-between;margin-top:28px;font-size:12px;color:#777}.portal-footer a{color:inherit}
      .portal-testnet{margin-left:10px;padding:3px 8px;border-radius:999px;background:#fff4d6;border:1px solid #e8c56a;color:#7a5200;font-size:10px;font-weight:700;letter-spacing:.12em}
      @media(max-width:480px){.portal-card{padding:28px}.portal-card h1{font-size:29px}}
    `}</style>
    <section className="portal-card">
      <a className="portal-brand" href="/">NEXSCROW ↗</a>
      <span className="portal-testnet" title="NEAR Testnet: test tokens with no real monetary value">TESTNET</span>
      <p className="portal-label">DAPPS PORTAL</p>
      <h1>Your next agent starts here.</h1>
      <p className="portal-copy">Sign in with Google via Privy, connect a NEAR wallet, or explore the workflow in demo mode.</p>
      {loading ? <p role="status">Loading Google sign-in…</p> : appId ? <PrivyProvider appId={appId} config={{ loginMethods: ["google"], appearance: { theme: "light", accentColor: "#171717" } }}><LoginOptions /></PrivyProvider> : <p className="portal-note">Google sign-in is not configured on this deployment.</p>}
      <button id="near-btn" className="portal-secondary" disabled={!nearReady || nearBusy} onClick={connectNear}>{nearBusy ? "Opening NEAR wallet…" : "Connect NEAR wallet"}</button>
      <div className="portal-divider" />
      <button className="portal-secondary" disabled={demoBusy} onClick={enterDemo}>{demoBusy ? "Starting demo…" : "Enter demo mode"}</button>
      <p className="portal-note">Use Google for social sign-in or connect a NEAR Testnet wallet (accounts ending in .testnet). Payments use NEAR Testnet test tokens with no real monetary value. Demo funds and payments are simulated; signing in never authorizes a payment.</p>
      {error && <p role="alert" className="portal-error">{error}</p>}
      <div className="portal-footer"><a href="/">← Back to landing</a><span>Agents · $0.10 / call</span></div>
    </section>
  </main>
}
