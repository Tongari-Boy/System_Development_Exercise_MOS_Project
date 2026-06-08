import { useEffect, useMemo, useState } from 'react'
import './MenuManagement.css'

const STORAGE_KEY = 'menuList_v2'

const defaultMenus = [
  {
    id: 'M001',
    name: '枝豆',
    price: 380,
    soldOut: false,
    active: true,
    tags: ['定番'],
  },
  {
    id: 'M002',
    name: '唐揚げ',
    price: 580,
    soldOut: false,
    active: true,
    tags: ['人気'],
  },
  {
    id: 'M003',
    name: 'ハイボール',
    price: 450,
    soldOut: true,
    active: true,
    tags: ['定番'],
  },
]

function loadMenus() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultMenus
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : defaultMenus
  } catch {
    return defaultMenus
  }
}

function saveMenus(list) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const yen = (n) => `¥${Number(n || 0).toLocaleString('ja-JP')}`

export default function MenuManagement({ onBack }) {
  const [tab, setTab] = useState('active') // active | inactive | soldout | price
  const [menus, setMenus] = useState(() => loadMenus())
  const [query, setQuery] = useState('')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('add')
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: 0,
    soldOut: false,
    active: true,
    tags: '',
  })
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    saveMenus(menus)
  }, [menus])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menus.filter((m) => {
      if (!q) return true
      return (
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [menus, query])

  const activeMenus = filtered.filter((m) => m.active)
  const inactiveMenus = filtered.filter((m) => !m.active)
  const soldOutMenus = filtered.filter((m) => m.active && m.soldOut)

  const openAdd = () => {
    setMode('add')
    setForm({
      id: makeNextId(menus),
      name: '',
      price: 0,
      soldOut: false,
      active: true,
      tags: '',
    })
    setError('')
    setOpen(true)
  }

  const openEdit = (m) => {
    setMode('edit')
    setForm({
      ...m,
      tags: m.tags.join(','),
    })
    setError('')
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setError('')
  }

  const save = () => {
    const name = form.name.trim()
    if (!name) {
      setError('商品名を入力してください')
      return
    }

    const payload = {
      id: form.id,
      name,
      price: Number(form.price),
      soldOut: !!form.soldOut,
      active: !!form.active,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    if (mode === 'add') {
      setMenus((prev) => [payload, ...prev])
    } else {
      setMenus((prev) =>
        prev.map((m) => (m.id === payload.id ? payload : m))
      )
    }

    closeModal()
  }

  const toggleSoldOut = (m) => {
    setMenus((prev) =>
      prev.map((x) =>
        x.id === m.id ? { ...x, soldOut: !x.soldOut } : x
      )
    )
  }

  const disableMenu = (m) => {
    setMenus((prev) =>
      prev.map((x) =>
        x.id === m.id ? { ...x, active: false, soldOut: false } : x
      )
    )
  }

  const enableMenu = (m) => {
    setMenus((prev) =>
      prev.map((x) =>
        x.id === m.id ? { ...x, active: true } : x
      )
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setMenus((prev) => prev.filter((m) => m.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const list =
    tab === 'active'
      ? activeMenus
      : tab === 'inactive'
      ? inactiveMenus
      : tab === 'soldout'
      ? soldOutMenus
      : activeMenus

  return (
    <section className="menuPage">
      <div className="menuHeader">
        <h2 className="menuTitle">メニュー管理</h2>
        <div className="menuHeaderActions">
          <button className="btn ghost" onClick={onBack}>戻る</button>
          <button className="btn primary" onClick={openAdd}>＋ 追加</button>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'active' ? 'tab active' : 'tab'} onClick={() => setTab('active')}>有効一覧</button>
        <button className={tab === 'inactive' ? 'tab active' : 'tab'} onClick={() => setTab('inactive')}>無効一覧</button>
        <button className={tab === 'soldout' ? 'tab active' : 'tab'} onClick={() => setTab('soldout')}>売切</button>
        <button className={tab === 'price' ? 'tab active' : 'tab'} onClick={() => setTab('price')}>価格</button>
      </div>

      <input
        className="input"
        placeholder="検索（商品名・タグ）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="list">
        {list.map((m) => (
          <div key={m.id} className="row">
            <div className="main">
              <div className="nameLine">
                <span className="name">{m.name}</span>
                <div className="tags">
                  {m.tags.map((t, i) => (
                    <span key={i} className="tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="meta">
                <span className="chip">{m.id}</span>
                <span className="chip">{yen(m.price)}</span>
                {m.soldOut && <span className="badge">売切</span>}
              </div>
            </div>

            <div className="actions">
              {tab !== 'price' && (
                <button className="btn small" onClick={() => openEdit(m)}>編集</button>
              )}

              {tab === 'active' && (
                <>
                  <button className="btn small" onClick={() => toggleSoldOut(m)}>
                    {m.soldOut ? '売切解除' : '売切'}
                  </button>
                  <button className="btn small warn" onClick={() => disableMenu(m)}>
                    無効化
                  </button>
                </>
              )}

              {tab === 'inactive' && (
                <>
                  <button className="btn small primary" onClick={() => enableMenu(m)}>
                    再有効化
                  </button>
                  <button className="btn small warn" onClick={() => setDeleteTarget(m)}>
                    削除
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <>
          <div className="overlay" onClick={closeModal} />
          <div className="modal">
            <h3>{mode === 'add' ? '商品追加' : '商品編集'}</h3>

            <input className="input" value={form.name} placeholder="商品名"
              onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <input className="input" type="number" value={form.price} placeholder="価格"
              onChange={(e) => setForm({ ...form, price: e.target.value })} />

            <input className="input" value={form.tags} placeholder="タグ（,区切り）"
              onChange={(e) => setForm({ ...form, tags: e.target.value })} />

            {error && <div className="error">{error}</div>}

            <div className="modalActions">
              <button className="btn ghost" onClick={closeModal}>キャンセル</button>
              <button className="btn primary" onClick={save}>保存</button>
            </div>
          </div>
        </>
      )}

      {deleteTarget && (
        <>
          <div className="overlay" onClick={() => setDeleteTarget(null)} />
          <div className="modal">
            <p><strong>{deleteTarget.name}</strong> を完全に削除しますか？</p>
            <div className="modalActions">
              <button className="btn ghost" onClick={() => setDeleteTarget(null)}>キャンセル</button>
              <button className="btn warn" onClick={confirmDelete}>削除</button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function makeNextId(list) {
  const nums = list
    .map((m) => m.id)
    .filter((id) => /^M\d+$/.test(id))
    .map((id) => Number(id.slice(1)))
  const next = (nums.length ? Math.max(...nums) : 0) + 1
  return `M${String(next).padStart(3, '0')}`
}
