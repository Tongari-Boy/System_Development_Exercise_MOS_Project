const STORAGE_KEY = 'orderHistory'

export const orderHistoryRepository = {
  async load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  },

  async save(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
      return true
    } catch {
      return false
    }
  },

  async clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch {
      return false
    }
  }
}
