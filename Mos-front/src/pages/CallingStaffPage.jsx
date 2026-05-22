import { Link } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import '../menu.css'

export default function CallingStaffPage() {
  return (
    <MenuLayout activeTab="call">
      <div className="calling-screen">
        <div className="calling-card">
          <div className="calling-animation">
            <div className="calling-dot"></div>
            <div className="calling-dot"></div>
            <div className="calling-dot"></div>
          </div>
          <h2>只今呼び出し中...</h2>
          <p>店員が参ります。お待ちください。</p>
          <Link to="/menu" className="calling-button">戻る</Link>
        </div>
      </div>
    </MenuLayout>
  )
}
