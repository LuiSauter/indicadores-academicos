
export const ENDPOINTS = {
  AUTH: '/api/auth',
  LOGOUT: '/api/logout',
  USERS: '/api/users',
  RECOVER_PASSWORD: '/api/forgot-password',
  RESET_PASSWORD: '/api/reset-password',
  STORE: '/api/store',
  STORE_COMMENT: '/api/store-comment',
  CATEGORY: '/api/category'
}

export const API_BASEURL = "https://data-mart-dy4i.onrender.com/api/"
export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
