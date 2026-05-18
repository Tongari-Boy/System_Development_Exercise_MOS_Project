import { Link } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import '../menu.css'

export default function OrderSendPage() {
  return (
    <MenuLayout activeTab="free">
      <div className="modal-overlay">
        <div className="modal-card">
          <p>注文を確定しますか？</p>
          <div className="modal-actions">
            <button type="button" className="modal-button">はい</button>
            <Link to="/menu" className="modal-button is-dark">いいえ</Link>
          </div>
        </div>
      </div>
    </MenuLayout>
  )
}
