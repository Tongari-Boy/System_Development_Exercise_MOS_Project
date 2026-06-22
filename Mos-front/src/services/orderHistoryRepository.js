import { orderApi } from './api.jsx'

export const orderHistoryRepository = {
  async load() {
    try {
      const seatId = sessionStorage.getItem('seatId')
      if (!seatId) return []
      const orders = await orderApi.getOrdersByTable(seatId)
      // バックエンドの OrderResponse を HistoryPage が期待する形式に変換
      return orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        items: (order.items || []).map((it) => ({
          name: it.itemName,
          qty: it.quantity,
        })),
      }))
    } catch {
      return []
    }
  },

  // バックエンドが主記録のため save/clear は no-op
  async save() { return true },
  async clear() { return true },
}

