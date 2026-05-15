import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import About from './Customer';
function Home() {
  return (
    <>
      <div className="page-title">
        <h1>居酒屋みどり亭</h1>
      </div>

      <div className="welcome-text">
        <h1>いらっしゃいませ</h1>
        <h2>ボタンをお選びください</h2>
      </div>

      <div className="button-row">
        <Link to="/about" className="nav-button customer-button">
          お客様用画面へ移行
        </Link>
      </div>

      <Link to="/staff" className="nav-button staff-button">
        スタッフ用画面
      </Link>
    </>
  )
}

function CustomerPage() {
  return (
    <div className="page-content">
      <h2>お客様用画面</h2>
      <p>こちらからメニューやご注文の確認・操作ができます。</p>

      <Link to="/" className="nav-button back-button">
        トップへ戻る
      </Link>
    </div>
  )
}

function StaffPage() {
  return (
    <div className="page-content">
      <h2>スタッフ用画面</h2>
      <p>スタッフ専用の管理機能へアクセスします。</p>

      <Link to="/" className="nav-button back-button">
        トップへ戻る
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-main">
        <main className="home-section">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About/>} />
            <Route path="/Customer" element={<CustomerPage />} />
            <Route path="/staff" element={<StaffPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App