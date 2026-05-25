import { useEffect, useMemo, useState } from 'react'
import './StaffManagement.css'

const STORAGE_KEY = 'staffList_v1'

const ROLE_LABEL = {
  manager: '店長',
  staff: '従業員',
}

const defaultStaff = [
  { id: 'S001', name: '山田 太郎', role: 'staff', active: true },
  { id: 'S002', name: '佐藤 花子', role: 'manager', active: true },
  { id: 'S003', name: '鈴木 一郎', role: 'staff', active: false },
]

function loadStaff() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultStaff
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return defaultStaff
  } catch {
    return defaultStaff
  }
}

function saveStaff(list) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function StaffManagement({ onBack }) {
  const [staff, setStaff] = useState(() => loadStaff())

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // all | active | inactive

  // modal
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('add') // add | edit
  const [form, setForm] = useState({ id: '', name: '', role: 'staff', active: true })
  const [error, setError] = useState('')

  useEffect(() => {
    saveStaff(staff)
  }, [staff])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return staff
      .filter((s) => {
        if (filter === 'active') return s.active
        if (filter === 'inactive') return !s.active
        return true
      })
      .filter((s) => {
        if (!q) return true
        return (
          s.id.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          ROLE_LABEL[s.role].toLowerCase().includes(q)
        )
      })
      // 表示順：有効 → 無効、店長 → 従業員、ID昇順
      .sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1
        if (a.role !== b.role) return a.role === 'manager' ? -1 : 1
        return a.id.localeCompare(b.id)
      })
  }, [staff, query, filter])

  const openAdd = () => {
    setMode('add')
    setForm({ id: '', name: '', role: 'staff', active: true })
    setError('')
    setOpen(true)
  }

  const openEdit = (s) => {
    setMode('edit')
    setForm({ ...s })
    setError('')
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setError('')
  }

  const validate = () => {
    const id = form.id.trim()
    const name = form.name.trim()
    if (!id) return 'IDを入力してください'
    if (!name) return '名前を入力してください'

    if (mode === 'add') {
      const exists = staff.some((s) => s.id.toLowerCase() === id.toLowerCase())
      if (exists) return '同じIDがすでに存在します'
    }
    return ''
  }

  const save = () => {
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      role: form.role,
      active: !!form.active,
    }

    if (mode === 'add') {
      setStaff((prev) => [payload, ...prev])
    } else {
      setStaff((prev) => prev.map((s) => (s.id === payload.id ? payload : s)))
    }

    closeModal()
  }

  const toggleActive = (id) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    )
  }

  return (
    <section className="staffPage">
      <div className="staffHeader">
        <div>
          <h2 className="staffTitle">従業員管理</h2>
          <div className="staffSub">削除はせず「無効化」で管理します</div>
        </div>

        <div className="staffHeaderActions">
          <button className="btn ghost" type="button" onClick={onBack}>
            戻る
          </button>
          <button className="btn primary" type="button" onClick={openAdd}>
            ＋ 追加
          </button>
        </div>
      </div>

      <div className="staffControls">
        <input
          className="input"
          value={query}
          placeholder="検索（名前 / ID / 権限）"
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="seg">
          <button
            className={`segBtn ${filter === 'all' ? 'active' : ''}`}
            type="button"
            onClick={() => setFilter('all')}
          >
            全件
          </button>
          <button
            className={`segBtn ${filter === 'active' ? 'active' : ''}`}
            type="button"
            onClick={() => setFilter('active')}
          >
            有効
          </button>
          <button
            className={`segBtn ${filter === 'inactive' ? 'active' : ''}`}
            type="button"
            onClick={() => setFilter('inactive')}
          >
            無効
          </button>
        </div>
      </div>

      <div className="staffList">
        {filtered.map((s) => (
          <div key={s.id} className={`staffRow ${s.active ? '' : 'inactive'}`}>
            <div className="staffMain">
              <div className="staffName">{s.name}</div>
              <div className="staffMeta">
                <span className="chip">{s.id}</span>
                <span className={`chip role ${s.role}`}>{ROLE_LABEL[s.role]}</span>
                <span className={`chip status ${s.active ? 'ok' : 'ng'}`}>
                  {s.active ? '有効' : '無効'}
                </span>
              </div>
            </div>

            <div className="staffActions">
              <button className="btn small" type="button" onClick={() => openEdit(s)}>
                編集
              </button>

              <button
                className={`btn small ${s.active ? 'warn' : 'primary'}`}
                type="button"
                onClick={() => toggleActive(s.id)}
              >
                {s.active ? '無効化' : '有効化'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty">
            <p>該当する従業員がいません。</p>
          </div>
        )}
      </div>

      {/* ===== モーダル（追加/編集 共通） ===== */}
      {open && (
        <>
          <div className="overlay" onClick={closeModal} />

          <div className="modal" role="dialog" aria-modal="true">
            <div className="modalTitle">
              {mode === 'add' ? '従業員追加' : '従業員編集'}
            </div>

            <div className="form">
              <label className="label">
                名前
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="例：山田 太郎"
                />
              </label>

              <label className="label">
                ID（ログインID）
                <input
                  className="input"
                  value={form.id}
                  onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
                  placeholder="例：S001"
                  disabled={mode === 'edit'}
                />
              </label>

              <label className="label">
                権限
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="staff">従業員</option>
                  <option value="manager">店長</option>
                </select>
              </label>

              <label className="label row">
                状態
                <div className="toggle">
                  <button
                    type="button"
                    className={`toggleBtn ${form.active ? 'active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, active: true }))}
                  >
                    有効
                  </button>
                  <button
                    type="button"
                    className={`toggleBtn ${!form.active ? 'active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, active: false }))}
                  >
                    無効
                  </button>
                </div>
              </label>

              {error && <div className="error">{error}</div>}
            </div>

            <div className="modalActions">
              <button className="btn ghost" type="button" onClick={closeModal}>
                キャンセル
              </button>
              <button className="btn primary" type="button" onClick={save}>
                保存
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default StaffManagement