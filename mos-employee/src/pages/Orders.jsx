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
      { name: '枝豆', qty: 1, cooked: false },
      { name: '唐揚げ', qty: 2, cooked: false },
      { name: 'ハイボール', qty: 2, cooked: false },
    ],
  },
  {
    id: 'o2',
    table: 'T2',
    time: '13:00',
    status: '調理中',
    items: [
      { name: 'ポテト', qty: 1, cooked: false },
      { name: 'レモンサワー', qty: 2, cooked: false },
    ],
  },
  {
    id: 'o3',
    table: 'C1',
    time: '13:45',
    status: '提供待ち',
    items: [
      { name: '刺身盛り', qty: 1, cooked: true },
      { name: '日本酒', qty: 1, cooked: true },
    ],
  },
  {
    id: 'o4',
    table: 'C2',
    time: '14:10',
    status: '完了',
    items: [
      { name: 'お茶', qty: 2, cooked: true },
    ],
  },
]

const FILTERS = [
  { key: 'all', label: '全件' },
  { key: '未確認', label: '未確認' },
  { key: '調理中', label: '調理中' },
  { key: '提供待ち', label: '提供待ち' },
  { key: '完了', label: '完了' },
]

function Orders() {
  const [orders, setOrders] = useState(initialOrders)
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  // 並び順：未確認 → 調理中 → 提供待ち → 完了
  const sortedOrders = useMemo(() => {
    const rank = { '未確認': 0, '調理中': 1, '提供待ち': 2, '完了': 3 }
    return [...orders].sort(
      (a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9)
    )
  }, [orders])

  // 未確認件数（全体）
  const urgentCount = useMemo(
    () => orders.filter((o) => o.status === '未確認').length,
    [orders]
  )

  // フィルタ + 検索（卓番号 or 商品名）
  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase()

    return sortedOrders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false

      if (!q) return true

      const hitTable = o.table.toLowerCase().includes(q)
      const hitItems = o.items.some((it) => it.name.toLowerCase().includes(q))

      return hitTable || hitItems
    })
  }, [sortedOrders, statusFilter, query])

  const visibleCount = filteredOrders.length
  const totalCount = orders.length

  const totalPages = Math.max(1, Math.ceil(visibleCount / PER_PAGE))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageOrders = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filteredOrders.slice(start, start + PER_PAGE)
  }, [filteredOrders, page])

  // 未確認 → 調理中
  const startCooking = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === '未確認'
          ? { ...o, status: '調理中' }
          : o
      )
    )
  }

  // 料理ごとの調理完了チェック
  const toggleCooked = (orderId, itemIndex) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        if (o.status !== '調理中') return o

        const nextItems = o.items.map((item, idx) =>
          idx === itemIndex
            ? { ...item, cooked: !item.cooked }
            : item
        )

        const allCooked =
          nextItems.length > 0 && nextItems.every((item) => item.cooked)

        return {
          ...o,
          items: nextItems,
          status: allCooked ? '提供待ち' : '調理中',
        }
      })
    )
  }

  // 提供待ち → 完了
  const completeServing = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === '提供待ち'
          ? { ...o, status: '完了' }
          : o
      )
    )
  }

  return (
    <section className="orders">
      <header className="ordersHeader">
        <div className="ordersHeaderLeft">
          <h2 className="ordersTitle">注文管理</h2>
          <div className="ordersMeta">
            表示 {visibleCount} 件 / 全 {totalCount} 件
          </div>
        </div>

        {urgentCount > 0 && (
          <div className="urgentCount">
            未確認 <strong>{urgentCount}</strong> 件
          </div>
        )}
      </header>

      {/* フィルタ + 検索 */}
      <div className="ordersTools">
        <div className="ordersFilters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`filterBtn ${statusFilter === f.key ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter(f.key)
                setPage(1)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          className="ordersSearch"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder="検索（卓番号 / 商品名）"
        />
      </div>

      <div className="ordersList">
        {pageOrders.map((o) => (
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
                <li
                  key={idx}
                  className={`itemRow ${it.cooked ? 'done' : ''}`}
                >
                  <div className="itemLeft">
                    <button
                      type="button"
                      className={`cookCheck ${it.cooked ? 'checked' : ''}`}
                      onClick={() => toggleCooked(o.id, idx)}
                      disabled={o.status !== '調理中'}
                      title={o.status !== '調理中' ? '調理中のときだけ操作できます' : ''}
                    >
                      {it.cooked ? '✓' : ''}
                    </button>

                    <span className="itemName">{it.name}</span>
                  </div>

                  <span className="itemQty">× {it.qty}</span>
                </li>
              ))}
            </ul>

            <div className="orderActions">
              {o.status === '未確認' && (
                <button
                  className="primaryBtn2"
                  type="button"
                  onClick={() => startCooking(o.id)}
                >
                  確認
                </button>
              )}

              {o.status === '調理中' && (
                <button className="waitingBtn" type="button" disabled>
                  全料理の調理完了で提供待ちになります
                </button>
              )}

              {o.status === '提供待ち' && (
                <button
                  className="primaryBtn2"
                  type="button"
                  onClick={() => completeServing(o.id)}
                >
                  提供完了
                </button>
              )}

              {o.status === '完了' && (
                <button className="doneBtn" type="button" disabled>
                  完了済み
                </button>
              )}
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
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          type="button"
        >
          ←
        </button>

        <div className="pagerNums">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          type="button"
        >
          →
        </button>
      </nav>
    </section>
  )
}

export default Orders