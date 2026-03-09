import axios from 'axios'
import { getToken } from './authService'

const API = '/api/pets'
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const getPets   = ()      => axios.get(API, authHeaders())
export const getPet    = (id)    => axios.get(`${API}/${id}`, authHeaders())
export const createPet = (data)  => axios.post(API, data, authHeaders())
export const updatePet = (id, d) => axios.put(`${API}/${id}`, d, authHeaders())
export const deletePet = (id)    => axios.delete(`${API}/${id}`, authHeaders())
