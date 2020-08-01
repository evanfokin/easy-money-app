import axios from 'axios'
import _flatten from 'lodash/flatten'
import { getRepository } from 'typeorm'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'

export const api = axios.create({
  baseURL: '/api'
})

const savedTokenKey = 'authToken'

saveAuthToken(getSavedAuthToken())

export function getSavedAuthToken(): string {
  return localStorage[savedTokenKey]
}

export async function isLoggedIn(): Promise<boolean> {
  const token = getSavedAuthToken()
  if (!token) return false

  try {
    await updateToken()
    return true
  } catch {
    removeAuthToken()
    return false
  }
}

export async function signUp(data: { name: string; email: string; password: string }) {
  await api.post('/auth/sign-up', data)
  return login(data.email, data.password)
}

export async function login(email: string, password: string) {
  const {
    data: { accessToken }
  } = await api.post('/auth/login', { email, password })
  saveAuthToken(accessToken)
  return getSavedAuthToken()
}

export async function updateToken() {
  const {
    data: { accessToken }
  } = await api.post('/auth/update-token')
  saveAuthToken(accessToken)
}

export function saveAuthToken(token: string) {
  if (!token) return
  localStorage[savedTokenKey] = token
  api.defaults.headers.authorization = `Bearer ${token}`
}

export function removeAuthToken() {
  delete localStorage[savedTokenKey]
  delete api.defaults.headers.authorization
}

export async function sync(timeout?: number) {
  if (!(await isLoggedIn())) return

  const categoriesRepo = getRepository(Category)
  const transactionsRepo = getRepository(Transaction)

  const categories = await categoriesRepo.find({ relations: ['transactions'] })
  const transactions = _flatten(categories.map(c => c.transactions))

  const { data } = await api.post<{
    categories: Category[]
    transactions: Transaction[]
  }>('/sync', { transactions, categories }, { timeout })

  await Promise.all(
    data.categories.map(async category => {
      delete category.transactions
      await categoriesRepo.save(category)
    })
  )

  await Promise.all(
    data.transactions.map(async transaction => {
      await transactionsRepo.save(transaction)
    })
  )
}
