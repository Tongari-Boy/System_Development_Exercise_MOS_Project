import { useState } from 'react'
import StaffManagement from './StaffManagement'
import MenuManagement from './MenuManagement'

function Store() {
  // hub: 店舗管理トップ / staff: 従業員管理 / menu: メニュー管理
  const [storeView, setStoreView] = useState('hub')

  if (storeView === 'staff') {
    return <StaffManagement onBack={() => setStoreView('hub')} />
  }

  if (storeView === 'menu') {
    return <MenuManagement onBack={() => setStoreView('hub')} />
  }

  return (
    <section className="page">
      <h2>店舗管理</h2>
      <p>管理したい項目を選択してください。</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <button
          style={tileStyle}
          onClick={() => setStoreView('menu')}
          type="button"
        >
          <div style={{ fontWeight: 900, fontSize: 18 }}>メニュー管理</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>
            商品一覧 / 価格変更 / 売り切れ設定
          </div>
        </button>

        <button
          style={tileStyle}
          onClick={() => setStoreView('staff')}
          type="button"
        >
          <div style={{ fontWeight: 900, fontSize: 18 }}>従業員管理</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>
            従業員一覧 / 権限 / 無効化
          </div>
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

export default Store
