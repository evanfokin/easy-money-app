import { getConnection, getRepository } from 'typeorm'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'
import moment from 'moment'
import _times from 'lodash/times'
import _compact from 'lodash/compact'
import _random from 'lodash/random'

export function wipe () {
  const connection = getConnection()
  return Promise.all(connection.entityMetadatas.map(data => {
    const repo = getRepository(data.target)
    return repo.delete({})
  }))
}

export async function addSampleData () {
  await wipe()

  const categoryRepository = getRepository(Category)
  const transactionRepository = getRepository(Transaction)

  const months = 4
  const getRandomTransaction = (times: number, min: number, max: number, round = 1) => {
    return _compact(_times(times, () => {
      return getRepository(Transaction).create({
        amount: getRandomNum(min, max, round),
        date: getRandomDate(moment().subtract(months, 'month'))
      })
    }))
  }

  let categories = [
    categoryRepository.create({
      type: 'income',
      name: 'Оклад',
      icon: 'cardOutline',
      transactions: _compact(_times(months, time => {
        const dayX = 1
        if (time === 0 && !checkDayX(dayX)) return

        return transactionRepository.create({
          amount: 50000,
          date: moment().subtract(time, 'month').set('date', dayX)
        })
      }))
    }),
    categoryRepository.create({
      type: 'income',
      name: 'Премия',
      icon: 'happyOutline',
      transactions: _compact(_times(months, time => {
        const dayX = 15
        if (time === 0 && !checkDayX(dayX)) return

        return transactionRepository.create({
          amount: getRandomNum(5000, 10000, 500),
          date: moment().subtract(time, 'month').set('date', dayX)
        })
      }))
    }),
    categoryRepository.create({
      type: 'income',
      name: 'Приработок',
      icon: 'rocketOutline',
      transactions: _compact(_times(months, time => {
        return transactionRepository.create({
          amount: getRandomNum(1500, 5000, 500),
          date: getRandomDate(moment().subtract(months, 'month'))
        })
      }))
    }),

    categoryRepository.create({
      type: 'expense',
      name: 'Продукты',
      icon: 'basketOutline',
      transactions: getRandomTransaction(months * 2, 300, 3000, 10)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Кафе',
      icon: 'cafeOutline',
      transactions: getRandomTransaction(_random(3, 5), 200, 500, 10)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Транспорт',
      icon: 'busOutline',
      transactions: [
        ...getRandomTransaction(_random(10, 15), 25, 25),
        ...getRandomTransaction(_random(1, 3), 110, 230, 10),
      ]
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Дом',
      icon: 'homeOutline',
      transactions: [
        ..._compact(_times(months, time => {
          const dayX = 5
          if (time === 0 && !checkDayX(dayX)) return

          return transactionRepository.create({
            amount: getRandomNum(3000, 4500, 1),
            comment: 'Квартплата',
            date: moment().subtract(time, 'month').set('date', dayX)
          })
        })),
        ...getRandomTransaction(1, 900, 5000, 100)
      ]
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Путешествия',
      icon: 'earthOutline',
      transactions: getRandomTransaction(_random(0, 1), 30000, 50000, 1000)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Здоровье',
      icon: 'medkitOutline',
      transactions: getRandomTransaction(1, 100, 1000, 10)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Одежда',
      icon: 'shirtOutline',
      transactions: getRandomTransaction(_random(1, 2), 2000, 5000, 100)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Развлечения',
      icon: 'filmOutline',
      transactions: getRandomTransaction(_random(1, 2), 500, 1500, 100)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Образование',
      icon: 'schoolOutline',
      transactions: getRandomTransaction(_random(1, 2), 1000, 5000, 100)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Подарки',
      icon: 'giftOutline',
      transactions: getRandomTransaction(_random(1, 2), 500, 1000, 500)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Техника',
      icon: 'laptopOutline',
      transactions: getRandomTransaction(_random(1, 2), 500, 5000, 100)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Связь',
      icon: 'callOutline',
      transactions: _compact(_times(months, time => {
        const dayX = 5
        if (time === 0 && !checkDayX(dayX)) return

        return transactionRepository.create({
          amount: 300,
          comment: 'За телефон',
          date: moment().subtract(time, 'month').set('date', dayX)
        })
      }))
    })
  ]

  await categoryRepository.save(categories)
  await Promise.all(categories.map(category => {
    const transactions = category.transactions.map(transaction => {
      transaction.categoryId = category.id
      if (moment.isMoment(transaction.date)) {
        transaction.date = (transaction.date as moment.Moment).toDate()
      }
      return transaction
    })

    return transactionRepository.save(transactions)
  }))
}

function checkDayX (date = 5) {
  const now = moment()
  const dayX = moment().set('date', date).startOf('day')
  return !now.isBefore(dayX)
}

function getRandomNum (min: number, max: number, round = 1) {
  return Math.round(_random(min, max) / round) * round
}

function getRandomDate (from: moment.Moment, to?: moment.Moment) {
  to = to || moment()
  const start = from.toDate()
  const end = to.toDate()

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

interface Migration {
  category: Category,
  transactions?: Transaction[]
}
