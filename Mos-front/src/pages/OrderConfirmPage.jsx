import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { MenuLayout } from '../components/MenuLayout'
import { CartContext } from '../CartContext'
import '../menu.css'

export default function OrderConfirmPage() {
  const { cartItems, removeFromCart } = useContext(CartContext)

  return (
    <MenuLayout activeTab="hold">
      <div className="order-confirm-screen">
        <div className="order-confirm-card">
          <h3>注文保留一覧</h3>
          
          {cartItems.length === 0 ? (
            <div className="order-empty-state">
              <p>注文予定の商品がありません。</p>
              <p className="order-empty-hint">メニューからカートに入れることで注文できます。</p>
            </div>
          ) : (
            <>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>商品名</th>
                    <th>価格</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.cartId}>
                      <td>{item.name}</td>
                      <td>{item.price}￥</td>
                      <td>
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeFromCart(item.cartId)}
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="order-total">
                <p>合計: {cartItems.reduce((sum, item) => sum + item.price, 0)}￥</p>
              </div>
            </>
          )}
          
          <Link to="/menu" className="order-button back-button">戻る</Link>
        </div>
      </div>
    </MenuLayout>
  )
}
