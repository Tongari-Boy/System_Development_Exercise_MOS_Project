import { useMemo, useState, useEffect } from 'react'
import './Orders.css'

const PER_PAGE = 8

const initialOrders = [
  {
    id: 'o1',
    table: 'T1',
    time: '12:00',
    status: '未確認',
    items: [
      { name: '枝豆', qty: 1 },
      { name: '唐揚げ', qty: 2 },
      { name: 'ハイボール', qty: 2 },
    ],
  },
  {
    id: 'o2',
    table: 'T2',
    time: '13:00',
    status: '調理中',
    items: [
      { name: 'ポテト', qty: 1 },
      { name: 'レモンサワー', qty: 2 },
    ],
  },
  {
    id: 'o3',
    table: 'C1',
    time: '13:45',
    status: '提供待ち',
    items: [
      { name: '刺身盛り', qty: 1 },
      { name: '日本酒', qty: 1 },
    ],
  },
  {
    id: 'o4',
    table: 'C2',
    time: '14:10',
    status: '未確認',
    items: [
      { name: 'お茶', qty: 2 },
    ],
  },
]

// フィルタ候補
const FILTERS = [
  { key: 'all', label: '全件' },
  { key: '未確認', label: '未確認' },
  { key: '調理中', label: '調理中' },
  { key: '提供待ち', label: '提供待ち' },
  { key: '完了', label: '完了' },
]

function Orders() {
  const [orders, setOrders] = useState(initialOrders)

  // フィルタ/検索
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  // ページング
  const [page, setPage] = useState(1)

  // 完了確認ダイアログ用
  const [confirmTarget, setConfirmTarget] = useState(null)

  // 並び順：未確認 → 調理中 → 提供待ち → 完了
  const sortedOrders = useMemo(() => {
    const rank = { '未確認': 0, '調理中': 1, '提供待ち': 2, '完了': 3 }
    return [...orders].sort(
      (a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9)
    )
  }, [orders])

  // ✅ 未確認件数（全体）
  const urgentCount = useMemo(
    () => orders.filter(o => o.status === '未確認').length,
    [orders]
  )

  // ✅ フィルタ + 検索（卓番号 or 商品名）
  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase()

    return sortedOrders.filter(o => {
      // フィルタ
      if (statusFilter !== 'all' && o.status !== statusFilter) return false

      // 検索：卓番号 / 商品名（どちらか含めばOK）
      if (!q) return true
      const hitTable = o.table.toLowerCase().includes(q)
      const hitItems = o.items.some(it => it.name.toLowerCase().includes(q))
      return hitTable || hitItems
    })
  }, [sortedOrders, statusFilter, query])

  // ✅ 表示件数（フィルタ・検索に連動）
  const visibleCount = filteredOrders.length
  const totalCount = orders.length

  // ページ数
  const totalPages = Math.max(1, Math.ceil(visibleCount / PER_PAGE))

  // フィルタ/検索で件数が変わって page がはみ出たら調整
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  // ページ単位の表示
  const pageOrders = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filteredOrders.slice(start, start + PER_PAGE)
  }, [filteredOrders, page])

  // ✅ 「確認」ボタン：未確認 → 調理中
  const markCooking = (id) => {
    setOrders(prev =>
      prev.map(o => (o.id === id && o.status === '未確認')
        ? { ...o, status: '調理中' }
        : o
      ))
  }

  // 完了確認ダイアログ
  const requestComplete = (order) => {
    setConfirmTarget(order)
  }

  // 確認OK → 注文を削除（=消える → 次が詰まって上に来る）
  const confirmComplete = () => {
    if (!confirmTarget) return
    setOrders(prev => prev.filter(o => o.id !== confirmTarget.id))
    setConfirmTarget(null)
  }

  const cancelComplete = () => setConfirmTarget(null)

  return (
    <section className="orders">
      <header className="ordersHeader">
        <div className="ordersHeaderLeft">
          <h2 className="ordersTitle">注文管理</h2>
          {/* 件数はフィルタ/検索に連動 */}
          <div className="ordersMeta">
            表示 {visibleCount} 件 / 全 {totalCount} 件
          </div>
        </div>

        {/* 未確認件数（全体） */}
        {urgentCount > 0 && (
          <div className="urgentCount">
            未確認 <strong>{urgentCount}</strong> 件
          </div>
        )}
      </header>

      {/* ✅ フィルタ + 検索 */}
      <div className="ordersTools">
        <div className="ordersFilters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              className={`filterBtn ${statusFilter === f.key ? 'active' : ''}`}
              onClick={() => { setStatusFilter(f.key); setPage(1) }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          className="ordersSearch"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder="検索（卓番号 / 商品名）"
        />
      </div>

      <div className="ordersList">
        {pageOrders.map(o => (
          <article key={o.id} className={`orderCard status-${o.status}`}>
            <div className="orderTop">
              <div className="orderMain">
                <div className="orderTable">{o.table}</div>
                <div className="orderTime">{o.time}</div>
              </div>
              <span className={`statusBadge status-${o.status}`}>
                {o.status}
              </span>
            </div>

            <ul className="itemList">
              {o.items.map((it, idx) => (
                <li key={idx} className="itemRow">
                  <span className="itemName">{it.name}</span>
                  <span className="itemQty">× {it.qty}</span>
                </li>
              ))}
            </ul>

            <div className="orderActions">
              {/* ✅ 確認：未確認→調理中 */}
              <button
                className="ghostBtn2"
                type="button"
                onClick={() => markCooking(o.id)}
                disabled={o.status !== '未確認'}
                title={o.status !== '未確認' ? '未確認のときだけ操作できます' : ''}
              >
                確認
              </button>

              <button
                className="primaryBtn2"
                type="button"
                onClick={() => requestComplete(o)}
              >
                完了
              </button>
            </div>
          </article>
        ))}

        {pageOrders.length === 0 && (
          <div className="emptyState">
            <p>該当する注文がありません。</p>
          </div>
        )}
      </div>

      {/* ページャー */}
      <nav className="pager" aria-label="ページ切り替え">
        <button
          className="pagerBtn"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          type="button"
        >
          ←
        </button>

        <div className="pagerNums">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`pagerNum ${n === page ? 'active' : ''}`}
              onClick={() => setPage(n)}
              type="button"
            >
              {n}
            </button>
          ))}
        </div>

        <button
          className="pagerBtn"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          type="button"
        >
          →
        </button>
      </nav>

      {/* 完了確認ダイアログ */}
      {confirmTarget && (
        <>
          <div className="confirmOverlay" onClick={cancelComplete} />
          <div className="confirmModal" role="dialog" aria-modal="true">
            <h3 className="confirmTitle">完了にしますか？</h3>
            <p className="confirmText">
              <strong>{confirmTarget.table}</strong>（{confirmTarget.time}）の注文を完了にします。
              <br />
              完了にすると一覧から消えます。
            </p>

            <div className="confirmActions">
              <button className="ghostBtn2" onClick={cancelComplete} type="button">
                キャンセル
              </button>
              <button className="dangerBtn" onClick={confirmComplete} type="button">
                OK（完了）
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default Orders