import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import { CartContext } from '../CartContext'
import '../menu.css'

export default function OrderSendPage() {
  const { cartItems, confirmOrder } = useContext(CartContext)
  const navigate = useNavigate()
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    if (cartItems.length === 0 && !isSent) {
      navigate('/menu')
    }
  }, [cartItems, isSent, navigate])

  const handleConfirm = () => {
    const didConfirm = confirmOrder()
    if (!didConfirm) {
      navigate('/menu')
      return
    }

    setIsSent(true)
    setTimeout(() => {
      navigate('/menu/categories')
    }, 2300)
  }

  return (
    <MenuLayout activeTab="send">
      <div className="modal-overlay">
        <div className="modal-card">
          <p>注文を確定しますか？</p>
          <div className="modal-actions">
            <button
              type="button"
              className="modal-button"
              onClick={handleConfirm}
              disabled={cartItems.length === 0}
            >
              はい
            </button>
            <Link to="/menu" className="modal-button is-dark">いいえ</Link>
          </div>
        </div>
      </div>

      {isSent && (
        <div className="toast-overlay" role="status" aria-live="polite">
          <div className="toast-card">
            注文が送信されました
            <br />
            ホーム画面へ戻ります
          </div>
        </div>
      )}
    </MenuLayout>
  )
}
