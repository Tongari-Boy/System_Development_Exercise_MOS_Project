import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../CartContext'
import '../menu.css'

export function MenuLayout({ activeTab, children, showCheckout, onCheckoutClick }) {
  const { cartCount } = useContext(CartContext)
  const navigate = useNavigate()
  const initialRemainingSeconds = 30
  const countdownStorageKey = 'mosRemainingUntil'
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemainingSeconds)

  const remainingLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [remainingSeconds])

  useEffect(() => {
    const storedUntil = Number(sessionStorage.getItem(countdownStorageKey))
    const now = Date.now()
    const initialUntil = storedUntil && storedUntil > now
      ? storedUntil
      : now + initialRemainingSeconds * 1000

    if (initialUntil !== storedUntil) {
      sessionStorage.setItem(countdownStorageKey, String(initialUntil))
    }

    const updateRemaining = () => {
      const diffSeconds = Math.max(0, Math.ceil((initialUntil - Date.now()) / 1000))
      setRemainingSeconds(diffSeconds)
    }

    updateRemaining()
    const timerId = setInterval(updateRemaining, 1000)

    return () => clearInterval(timerId)
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/menu')
    }
  }

      // 滞在時間については本来はサーバーからの情報を元に計算するべきですが、DB実装までは固定値で表示しています
  return (
    <div className="menu-screen">
      <header className="menu-header">
        <div className="menu-header-title">滞在時間</div>

        <div className="menu-header-content">
          <div className="remaining-time">
            <button
              type="button"
              className="header-back-button"
              onClick={handleBack}
            >
              戻る
            </button>
            <strong>{remainingLabel}</strong>
          </div>

          <div className="menu-header-buttons">
            <Link
              to="/history"
              className={`circle-button ${activeTab === 'history' ? 'is-active' : ''}`}
            >
              注文
              <br />
              履歴
            </Link>

            <Link
              to="/menu/c/free"
              className={`circle-button ${activeTab === 'free' ? 'is-active' : ''}`}
            >
              無料
              <br />
              備品
            </Link>

            <Link
              to="/order-confirm"
              className={`circle-button badge-parent ${activeTab === 'hold' ? 'is-active' : ''}`}
            >
              注文
              <br />
              保留
              <span className="badge">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="menu-content">{children}</main>

      <footer className="menu-footer">
        {showCheckout ? (
          <button
            type="button"
            className={`footer-button checkout-button ${activeTab === 'categories' ? 'is-current' : ''}`}
            onClick={onCheckoutClick}
          >
            お会計
          </button>
        ) : (
          <Link
            to="/menu"
            className={`footer-button ${activeTab === 'categories' ? 'is-current' : ''}`}
          >
            ホームへ
          </Link>
        )}

        <Link
          to="/order-send"
          className={`footer-button badge-parent ${activeTab === 'send' ? 'is-current' : ''}`}
        >
          注文送信
          <span className="badge">{cartCount}</span>
        </Link>

        <Link
          to="/call-staff"
          className={`footer-button ${activeTab === 'call' ? 'is-current' : ''}`}
        >
          店員呼び出し
        </Link>
      </footer>
    </div>
  )
}
