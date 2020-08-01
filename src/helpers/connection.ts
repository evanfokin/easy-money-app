import localforage from 'localforage'
import { Connection, createConnection as vendorCreateConnection, getConnection as vendorGetConnection } from 'typeorm'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'

Object.assign(window, { localforage })

export async function createConnection() {
  const connection = getConnection()

  if (connection && connection.isConnected) {
    return connection
  }

  return vendorCreateConnection({
    type: 'sqljs',
    location: 'browser',
    autoSave: true,
    synchronize: true,
    useLocalForage: true,
    entities: [Category, Transaction]
  })
}

export function getConnection() {
  let connection: Connection = null

  try {
    connection = vendorGetConnection()
  } catch {}

  return connection
}

export async function closeConnection() {
  const connection = getConnection()

  if (!connection.isConnected) return
  else return getConnection().close()
}
