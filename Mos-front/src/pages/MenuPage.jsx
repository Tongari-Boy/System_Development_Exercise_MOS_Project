import { useContext } from 'react'
import { MenuLayout } from '../components/MenuLayout'
import { CartContext } from '../CartContext'
import '../menu.css'

const menuItems = [
  { id: 1, name: 'おしぼり', price: 100, image: '/oshibori.png', soldOut: false },
  { id: 2, name: '小皿', price: 0, image: '/kozara.png', soldOut: true },
  { id: 3, name: 'グラス', price: 0, image: '/glass.png', soldOut: true },
  { id: 4, name: '割り箸', price: 0, image: '', soldOut: true },
  { id: 5, name: 'お冷', price: 0, image: '', soldOut: true },
  { id: 6, name: '□□', price: 0, image: '', soldOut: false },
  { id: 7, name: '□□', price: 0, image: '', soldOut: false },
  { id: 8, name: '□□', price: 0, image: '', soldOut: false },
]

export default function MenuPage() {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price
    })
  }

  return (
    <MenuLayout activeTab="free">
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-card ${item.soldOut ? 'is-sold-out' : ''}`}
          >
            <div className="menu-image-area">
              {item.image ? (
                <img src={item.image} alt={item.name} className="menu-image" />
              ) : (
                <div className="menu-image-placeholder" />
              )}
              {item.soldOut && <div className="sold-out-label">売り切れ</div>}
            </div>

            <div className="menu-card-body">
              <p className="menu-item-name">{item.name}</p>
              <p className="menu-item-price">{item.price}￥</p>

              <button
                type="button"
                className="cart-button"
                disabled={item.soldOut}
                onClick={() => handleAddToCart(item)}
              >
                カートに入れる
              </button>
            </div>
          </div>
        ))}
      </div>
    </MenuLayout>
  )
}
