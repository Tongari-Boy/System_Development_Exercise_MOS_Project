// src/pages/AdminHub.jsx
import MenuManagement from './MenuManagement'
import StaffManagement from './StaffManagement'

export default function AdminHub({ user, onBack }) {
  // 社員：メニュー管理のみ（従業員管理は出さない）＝A
  if (user.role === 'employee') {
    return <MenuManagement onBack={onBack} />
  }

  // 店長：トップで選択
  return (
    <section className="page">
      <h2>店舗管理</h2>
      <p>管理したい項目を選択してください。</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <button style={tileStyle} type="button" onClick={() => onBack('menu')}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>メニュー管理</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>商品一覧 / 価格 / 売切</div>
        </button>

        <button style={tileStyle} type="button" onClick={() => onBack('staff')}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>従業員管理</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>追加 / 編集 / 無効化</div>
        </button>
      </div>
    </section>
  )
}

const tileStyle = {
  textAlign: 'left',
  padding: 14,
  borderRadius: 14,
  border: '1px solid rgba(0,0,0,0.10)',
  background: '#fff',
  boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
  cursor: 'pointer',
}