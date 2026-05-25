import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import { CartContext } from '../CartContext'
import '../menu.css'

export default function OrderSendPage() {
  const { cartItems, confirmOrder, orderHistory } = useContext(CartContext)
  const navigate = useNavigate()
  const [isSent, setIsSent] = useState(false)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)

  useEffect(() => {
    if (cartItems.length === 0 && !isSent) {
      navigate('/menu')
    }
  }, [cartItems, isSent, navigate])

  useEffect(() => {
    if (cartItems.length === 0) {
      setShowDuplicateWarning(false)
      return
    }

    const buildSignature = (items) => {
      const counts = items.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1
        return acc
      }, {})

      return Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, qty]) => `${name}:${qty}`)
        .join('|')
    }

    const currentSignature = buildSignature(cartItems)
    const recentOrders = orderHistory.slice(0, 5)
    const hasDuplicate = recentOrders.some((order) => (
      buildSignature(order.items) === currentSignature
    ))

    setShowDuplicateWarning(hasDuplicate)
  }, [cartItems, orderHistory])

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

      {showDuplicateWarning && !isSent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p>
              注文が重複している可能性があります。
              <br />
              過去5件以内に同じメニュー、同じ数量の注文があります。
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button"
                onClick={() => setShowDuplicateWarning(false)}
              >
                続行
              </button>
              <Link
                to="/menu"
                className="modal-button is-dark"
                onClick={() => setShowDuplicateWarning(false)}
              >
                キャンセル
              </Link>
            </div>
          </div>
        </div>
      )}

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
