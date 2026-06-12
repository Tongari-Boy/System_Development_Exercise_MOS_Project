import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearUser, clearUseCase, getUseCase, getUser, setUseCase } from '../auth/auth'
import { normalizeAllowedUseCases } from '../../domain/staff/staffDb'
import { ROLE_LABEL } from '../../domain/staff/staffMapper'
import { useNavStack } from '../../hooks/useNavStack'

import UseCaseSelect from '../../features/auth/UseCaseSelect'
import AdminHub from '../../features/admin/AdminHub'
import Orders from '../../features/orders/Orders'
import Seats from '../../features/seats/Seats'
import MenuManagement from '../../features/menu/MenuManagement'
import StaffManagement from '../../features/staff/StaffManagement'
import '../../styles/app.css'

export default function AppShell() {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) navigate('/', { replace: true })
  }, [user, navigate])

  const allowedUseCases = useMemo(() => {
    if (!user) return []
    return normalizeAllowedUseCases(user.role, user.allowedUseCases)
  }, [user])

  const [useCaseState, setUseCaseState] = useState(() => getUseCase())

  useEffect(() => {
    if (!user) return
    if (useCaseState) return
    if (allowedUseCases.length === 1) {
      const only = allowedUseCases[0]
      setUseCase(only)
      setUseCaseState(only)
    }
  }, [user, useCaseState, allowedUseCases])

  const initialScreen = useMemo(() => {
    if (useCaseState === 'hall') return 'seats'
    if (useCaseState === 'kitchen') return 'orders'
    if (useCaseState === 'admin') return 'adminHub'
    return 'usecase'
  }, [useCaseState])

  const nav = useNavStack(initialScreen)

  useEffect(() => {
    nav.reset(initialScreen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialScreen])

  const [logoutOpen, setLogoutOpen] = useState(false)

  useEffect(() => {
    if (!logoutOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLogoutOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [logoutOpen])

  if (!user) return null

  const requestLogout = () => setLogoutOpen(true)
  const cancelLogout = () => setLogoutOpen(false)
  const confirmLogout = () => {
    setLogoutOpen(false)
    clearUser()
    navigate('/', { replace: true })
  }

  const changeUseCase = () => {
    clearUseCase()
    setUseCaseState(null)
    nav.reset('usecase')
  }

  const selectUseCase = (uc) => {
    setUseCase(uc)
    setUseCaseState(uc)
  }

  let body = null
  let showBack = false

  if (!useCaseState) {
    body = <UseCaseSelect allowed={allowedUseCases} onSelect={selectUseCase} />
  } else if (useCaseState === 'hall') {
    body = <Seats />
  } else if (useCaseState === 'kitchen') {
    body = <Orders />
  } else if (useCaseState === 'admin') {
    const screen = nav.current

    if (screen === 'adminHub') {
      body = (
        <AdminHub
          user={user}
          onSelect={(next) => {
            if (next === 'menu') nav.push('menu')
            if (next === 'staff') nav.push('staff')
          }}
        />
      )
    } else if (screen === 'menu') {
      body = <MenuManagement onBack={() => nav.back()} />
      showBack = true
    } else if (screen === 'staff') {
      if (user.role !== 'manager') {
        body = (
          <section className="page">
            <h2>権限がありません</h2>
            <p>従業員管理は店長のみ利用できます。</p>
          </section>
        )
        showBack = true
      } else {
        body = <StaffManagement onBack={() => nav.back()} />
        showBack = true
      }
    } else {
      body = <MenuManagement onBack={() => nav.back()} />
      showBack = true
    }
  }

  const headerTitle =
    !useCaseState
      ? '用途選択'
      : useCaseState === 'hall'
      ? 'ホール（座席管理）'
      : useCaseState === 'kitchen'
      ? '厨房（注文管理）'
      : '業務（店舗管理）'

  return (
    <div className="shellPage">
      <ShellHeader
        title={headerTitle}
        userLabel={`${ROLE_LABEL[user.role]}：${user.name}`}
        onLogout={requestLogout}
        onChangeUseCase={useCaseState ? changeUseCase : null}
        onBack={showBack && nav.canBack ? nav.back : null}
      />

      {body}

      {logoutOpen && (
        <>
          <div className="overlay" onClick={cancelLogout} />
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modalTitle">ログアウトしますか？</div>
            <p className="confirmText">現在の作業画面からログアウトします。</p>
            <div className="modalActions">
              <button className="btn ghost" type="button" onClick={cancelLogout}>
                キャンセル
              </button>
              <button className="btn warn" type="button" onClick={confirmLogout}>
                ログアウト
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ShellHeader({ title, userLabel, onLogout, onChangeUseCase, onBack }) {
  return (
    <header className="shellHeader">
      <div className="shellHeaderRow">
        <div className="shellHeaderLeft">
          {onBack ? (
            <button className="btn ghost" type="button" onClick={onBack}>
              ← 戻る
            </button>
          ) : (
            <div style={{ width: 88 }} />
          )}
        </div>

        <div className="shellHeaderCenter">
          <div className="shellShop">居酒屋みどり亭</div>
          <div className="shellTitle">{title}</div>
        </div>

        <div className="shellHeaderRight">
          {onChangeUseCase && (
            <button className="btn ghost" type="button" onClick={onChangeUseCase}>
              用途変更
            </button>
          )}
          <button className="btn warn" type="button" onClick={onLogout}>
            ログアウト
          </button>
        </div>
      </div>
      <div className="shellUser">{userLabel}</div>
    </header>
  )
}
