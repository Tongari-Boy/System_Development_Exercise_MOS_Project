import { Link } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import '../menu.css'

const hasOrderHistory = false

export default function HistoryPage() {
  return (
    <MenuLayout activeTab="history">
      <div className="history-card">
        {!hasOrderHistory && (
          <div className="history-empty-state">注文履歴はまだありません。</div>
        )}
        <table className="history-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
          </tbody>
        </table>
        <div className="history-pagination">
          <span>◀</span>
          <span>1/1</span>
          <span>▶</span>
        </div>
      </div>
    </MenuLayout>
  )
}
