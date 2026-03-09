import axios from 'axios'

const API = '/api/auth'

export const login = (email, password) =>
  axios.post(`${API}/login`, { email, password })

export const register = (userData) =>
  axios.post(`${API}/register`, userData)

export const logout = () => localStorage.removeItem('token')
export const getToken = () => localStorage.getItem('token')
export const setToken = (token) => localStorage.setItem('token', token)
