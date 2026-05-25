import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearUser, getUseCase, getUser, setUseCase, clearUseCase } from './auth'
import { normalizeAllowedUseCases, ROLE_LABEL } from './staffDb'
import { useNavStack } from './useNavStack'
import UseCaseSelect from './UseCaseSelect'

import Orders from './pages/Orders'
import Seats from './pages/Seats'
import MenuManagement from './pages/MenuManagement'
import StaffManagement from './pages/StaffManagement'
import AdminHub from './pages/AdminHub'

import './Employee.css'

export default function Employee() {
  const navigate = useNavigate()
  const user = getUser()

  // ガード（保険）
  useEffect(() => {
    if (!user) navigate('/', { replace: true })
  }, [user, navigate])

  const allowedUseCases = useMemo(() => {
    if (!user) return []
    return normalizeAllowedUseCases(user.role, user.allowedUseCases)
  }, [user])

  const [useCase, setUseCaseState] = useState(() => getUseCase())

  // 1=A：選択肢が1つなら自動遷移（用途セット）
  useEffect(() => {
    if (!user) return
    if (useCase) return
    if (allowedUseCases.length === 1) {
      setUseCase(allowedUseCases[0])
      setUseCaseState(allowedUseCases[0])
    }
  }, [user, useCase, allowedUseCases])

  // 画面履歴（戻る＝ひとつ前）
  const initialScreen = useMemo(() => {
    if (useCase === 'hall') return 'seats'
    if (useCase === 'kitchen') return 'orders'
    if (useCase === 'admin') return 'adminHub'
    return 'usecase'
  }, [useCase])

  const nav = useNavStack(initialScreen)

  // 用途が変わったら履歴をリセット
  useEffect(() => {
    nav.reset(initialScreen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialScreen])

  // ===== ログアウト確認（②）ここから =====
  const [logoutOpen, setLogoutOpen] = useState(false)

  const requestLogout = () => setLogoutOpen(true)
  const cancelLogout = () => setLogoutOpen(false)

  const doLogout = () => {
    clearUser()
    navigate('/', { replace: true })
  }

  const confirmLogout = () => {
    setLogoutOpen(false)
    doLogout()
  }

  // ESCで閉じる
  useEffect(() => {
    if (!logoutOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLogoutOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [logoutOpen])
  // ===== ログアウト確認（②）ここまで =====

  const changeUseCase = () => {
    // 2=A：用途変更ボタンで用途選択に戻す
    clearUseCase()
    setUseCaseState(null)
    nav.reset('usecase')
  }

  if (!user) return null

  // 用途未選択なら用途選択画面
  if (!useCase) {
    return (
      <div className="content">
        <Header
          title="用途選択"
          left={nav.canBack ? () => nav.back() : null}
          onRequestLogout={requestLogout}
          onChangeUseCase={null}
          userLabel={`${ROLE_LABEL[user.role]}：${user.name}`}
        />

        <UseCaseSelect
          allowed={allowedUseCases}
          onSelect={(uc) => {
            setUseCase(uc)
            setUseCaseState(uc)
          }}
        />

        {logoutOpen && (
          <>
            <div className="logoutOverlay" onClick={cancelLogout} />
            <div className="logoutModal" role="dialog" aria-modal="true">
              <h3 className="logoutTitle">ログアウトしますか？</h3>
              <p className="logoutText">作業中の画面からログアウトします。</p>

              <div className="logoutActions">
                <button className="logoutCancel" type="button" onClick={cancelLogout}>
                  キャンセル
                </button>
                <button className="logoutOk" type="button" onClick={confirmLogout}>
                  OK（ログアウト）
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // 表示制限（用途→画面）
  const screen = nav.current
  let body = null

  if (useCase === 'hall') {
    body = <Seats />
  } else if (useCase === 'kitchen') {
    body = <Orders />
  } else if (useCase === 'admin') {
    // adminの中の制御：
    // - 社員：メニュー管理のみ（トップ出さず直行）
    // - 店長：トップ→メニュー or 従業員
    if (screen === 'adminHub') {
      body = (
        <AdminHub
          user={user}
          onBack={(next) => {
            if (next === 'menu') nav.push('menu')
            if (next === 'staff') nav.push('staff')
          }}
        />
      )
    } else if (screen === 'menu') {
      body = <MenuManagement onBack={() => nav.back()} />
    } else if (screen === 'staff') {
      // 店長のみ
      if (user.role !== 'manager') {
        body = (
          <section className="page">
            <h2>権限がありません</h2>
          </section>
        )
      } else {
        body = <StaffManagement onBack={() => nav.back()} />
      }
    } else {
      // 社員はadminHubを経由せずMenuへ（保険）
      body = <MenuManagement onBack={() => nav.back()} />
    }
  }

  const headerTitle =
    useCase === 'hall'
      ? 'ホール（座席管理）'
      : useCase === 'kitchen'
      ? '厨房（注文管理）'
      : '業務（店舗管理）'

  return (
    <div className="content">
      <Header
        title={headerTitle}
        left={nav.canBack ? () => nav.back() : null}
        onRequestLogout={requestLogout}
        onChangeUseCase={changeUseCase}
        userLabel={`${ROLE_LABEL[user.role]}：${user.name}`}
      />

      {body}

      {logoutOpen && (
        <>
          <div className="logoutOverlay" onClick={cancelLogout} />
          <div className="logoutModal" role="dialog" aria-modal="true">
            <h3 className="logoutTitle">ログアウトしますか？</h3>
            <p className="logoutText">作業中の画面からログアウトします。</p>

            <div className="logoutActions">
              <button className="logoutCancel" type="button" onClick={cancelLogout}>
                キャンセル
              </button>
              <button className="logoutOk" type="button" onClick={confirmLogout}>
                OK（ログアウト）
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/** 共通ヘッダー（用途変更ボタン付き） */
function Header({ title, left, onRequestLogout, onChangeUseCase, userLabel }) {
  return (
    <header className="topHeader">
      <div className="leftControls">
        {left ? (
          <button className="iconBtn" onClick={left} type="button" aria-label="戻る">
            ←
          </button>
        ) : (
          <div style={{ width: 42 }} />
        )}
      </div>

      <div className="titleBlock">
        <div className="shopName">居酒屋みどり亭</div>
        <div className="screenName">{title}</div>
      </div>

      <div className="rightControls">
        {onChangeUseCase && (
          <button className="btnMini" type="button" onClick={onChangeUseCase}>
            用途変更
          </button>
        )}
        <button className="btnMini" type="button" onClick={onRequestLogout}>
          ログアウト
        </button>
      </div>

      <div className="userMini">{userLabel}</div>
    </header>
  )
}