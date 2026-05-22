// src/auth.js
const USER_KEY = 'currentUser_v1'
const USECASE_KEY = 'currentUseCase_v1'

export const getUser = () => {
  const raw = sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearUser = () => {
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USECASE_KEY)
}

export const getUseCase = () => {
  return sessionStorage.getItem(USECASE_KEY) || null
}

export const setUseCase = (useCase) => {
  sessionStorage.setItem(USECASE_KEY, useCase)
}

export const clearUseCase = () => {
  sessionStorage.removeItem(USECASE_KEY)
}