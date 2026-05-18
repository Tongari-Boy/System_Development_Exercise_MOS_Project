import { Link } from 'react-router-dom'
import '../App.css'

export default function CheckoutPage() {
  return (
    <div className="page-content">
      <h2>お会計</h2>
      <p>お会計画面です。確認後はカスタマー画面へ戻ります。</p>

      <div className="button-row">
        <Link to="/customer" className="nav-button back-button">
          カスタマー画面へ戻る
        </Link>
      </div>
    </div>
  )
}
