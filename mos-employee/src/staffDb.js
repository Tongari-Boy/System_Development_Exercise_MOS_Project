// src/staffDb.js
const STAFF_KEY = 'staffList_v2'
const SEQ_S_KEY = 'seqEmployee_v1'   // S0001...
const SEQ_A_KEY = 'seqPartTime_v1'   // A0001...

const pad4 = (n) => String(n).padStart(4, '0')

export const ROLE_LABEL = {
  manager: '店長',
  employee: '社員',
  partTime: 'アルバイト',
}

export const USECASE_LABEL = {
  hall: 'ホール',
  kitchen: '厨房',
  admin: '業務',
}

// 初期データ（必要なら消してOK）
const defaultStaff = [
  {
    id: 'S0001',
    name: '店長 太郎',
    role: 'manager',
    active: true,
    password: '1111',
    allowedUseCases: ['hall', 'kitchen', 'admin'],
  },
  {
    id: 'S0002',
    name: '社員 花子',
    role: 'employee',
    active: true,
    password: '2222',
    allowedUseCases: ['hall', 'kitchen', 'admin'],
  },
  {
    id: 'A0001',
    name: 'アルバイト 次郎',
    role: 'partTime',
    active: true,
    password: '3333',
    allowedUseCases: ['hall', 'kitchen'], // adminなし
  },
]

export function loadStaff() {
  const raw = sessionStorage.getItem(STAFF_KEY)
  if (!raw) {
    // 初期採番の整合
    sessionStorage.setItem(SEQ_S_KEY, String(2))
    sessionStorage.setItem(SEQ_A_KEY, String(1))
    sessionStorage.setItem(STAFF_KEY, JSON.stringify(defaultStaff))
    return defaultStaff
  }
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : defaultStaff
  } catch {
    return defaultStaff
  }
}

export function saveStaff(list) {
  sessionStorage.setItem(STAFF_KEY, JSON.stringify(list))
}

function nextSeq(key) {
  const cur = Number(sessionStorage.getItem(key) || '0')
  const next = cur + 1
  sessionStorage.setItem(key, String(next))
  return next
}

export function generateId(role) {
  // 店長/社員はS、アルバイトはA
  if (role === 'partTime') {
    const n = nextSeq(SEQ_A_KEY)
    return `A${pad4(n)}`
  }
  const n = nextSeq(SEQ_S_KEY)
  return `S${pad4(n)}`
}

export function normalizeAllowedUseCases(role, allowedUseCases) {
  const set = new Set(allowedUseCases || [])
  // アルバイトは admin 強制不可
  if (role === 'partTime') set.delete('admin')
  return Array.from(set)
}

// 認証
export function authenticate(id, password) {
  const list = loadStaff()
  const user = list.find(s => s.id.toLowerCase() === String(id).toLowerCase())
  if (!user) return { ok: false, reason: 'IDが見つかりません' }
  if (!user.active) return { ok: false, reason: '無効化されています' }
  if (user.password !== password) return { ok: false, reason: 'パスワードが違います' }

  const allowed = normalizeAllowedUseCases(user.role, user.allowedUseCases)
  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      active: user.active,
      allowedUseCases: allowed,
    },
  }
}