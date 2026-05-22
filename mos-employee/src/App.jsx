import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { authenticate } from './staffDb'
import { setUser, clearUseCase } from './auth'

function App() {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => id.trim() && pw.trim(), [id, pw])

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    const res = authenticate(id.trim(), pw)
    if (!res.ok) {
      setError(res.reason)
      return
    }

    setUser(res.user)
    clearUseCase()
    navigate('/employee', { replace: true })
  }

  return (
    <>
      <div className="blackBanner">
        <h1>居酒屋みどり亭</h1>
      </div>

      <form className="loginCard" onSubmit={handleLogin}>
        <div className="loginTitle">ログイン</div>

        <div className="inputGroup">
          <input
            type="text"
            placeholder="ID（例：S0001 / A0001）"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="inputGroup">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <div style={{ padding: 10, borderRadius: 12, background: 'rgba(255,59,48,0.12)', fontWeight: 900 }}>{error}</div>}

        <button className="primaryBtn" type="submit" disabled={!canSubmit}>
          ログイン
        </button>

        <div className="helpText">※役職はIDに紐づいて自動判定されます</div>
      </form>
    </>
  )
}

export default App