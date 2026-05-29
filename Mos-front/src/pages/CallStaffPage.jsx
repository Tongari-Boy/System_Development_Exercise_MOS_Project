import { Link } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import '../menu.css'

export default function CallStaffPage() {
  return (
    <MenuLayout activeTab="call">
      <div className="modal-overlay">
        <div className="modal-card">
          <p>店員を呼び出しますか？</p>
          <div className="modal-actions">
            <Link to="/call-staff-calling" className="modal-button">呼び出す</Link>
            <Link to="/menu" className="modal-button is-dark">キャンセル</Link>
          </div>
        </div>
      </div>
    </MenuLayout>
  )
}