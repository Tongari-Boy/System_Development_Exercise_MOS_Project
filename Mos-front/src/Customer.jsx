import { Link } from "react-router-dom";
import "./customer.css";

export default function CustomerPage() {
  return (
    <div className="customer-container">
      <div className="customer-card">
        <h2 className="customer-title">お客様用画面</h2>

        <p className="customer-text">
          こちらからメニュー確認・注文・履歴の確認ができます。
        </p>

        <div className="customer-button-area">
          <Link to="/menu" className="customer-button menu-button">
            メニューを見る
          </Link>

          <Link to="/order" className="customer-button order-button">
            注文する
          </Link>

          <Link to="/history" className="customer-button confirm-button">
            注文履歴
          </Link>
        </div>

        <Link to="/" className="customer-button back-button">
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}