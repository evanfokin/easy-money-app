import { getRepository } from 'typeorm'
import { Category } from '../entities/Category'
import { Transaction } from '../entities/Transaction'
import moment from 'moment'
import _times from 'lodash/times'
import _compact from 'lodash/compact'
import _random from 'lodash/random'

export function wipe() {
  const deletedAt = new Date()
  return Promise.all(
    [Category, Transaction].map(Entity => {
      const repo = getRepository(Entity)
      return repo.update({ deletedAt: null }, { deletedAt, updatedAt: deletedAt })
    })
  )
}

export async function addSampleData() {
  await wipe()

  const categoryRepository = getRepository(Category)
  const transactionRepository = getRepository(Transaction)

  const months = 2
  const getRandomTransaction = (times: number, min: number, max: number, round = 1, comment = '') => {
    return _compact(
      _times(times, () => {
        return getRepository(Transaction).create({
          amount: getRandomNum(min, max, round),
          comment,
          date: getRandomDate(moment().subtract(months, 'month'))
        })
      })
    )
  }

  let categories = [
    categoryRepository.create({
      type: 'income',
      name: 'Оклад',
      budget: 70000,
      icon: 'cardOutline',
      transactions: _compact(
        _times(months, time => {
          const dayX = 1
          if (time === 0 && !checkDayX(dayX)) return

          return transactionRepository.create({
            amount: 70000,
            date: moment().subtract(time, 'month').set('date', dayX)
          })
        })
      )
    }),
    categoryRepository.create({
      type: 'income',
      name: 'Премия',
      budget: 8000,
      icon: 'happyOutline',
      transactions: _compact(
        _times(months, time => {
          const dayX = 15
          if (time === 0 && !checkDayX(dayX)) return

          return transactionRepository.create({
            amount: getRandomNum(8000, 15000, 500),
            date: moment().subtract(time, 'month').set('date', dayX)
          })
        })
      )
    }),
    categoryRepository.create({
      type: 'income',
      name: 'Приработок',
      budget: 3000,
      icon: 'rocketOutline',
      transactions: _compact(
        _times(months, time => {
          return transactionRepository.create({
            amount: getRandomNum(2000, 5000, 500),
            date: getRandomDate(moment().subtract(months, 'month'))
          })
        })
      )
    }),

    categoryRepository.create({
      type: 'expense',
      name: 'Продукты',
      budget: 8000,
      icon: 'basketOutline',
      transactions: [
        ...getRandomTransaction(_random(10, 15), 100, 500, 10),
        ...getRandomTransaction(months, 2000, 3000, 10)
      ]
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Кафе',
      budget: 3000,
      icon: 'cafeOutline',
      transactions: getRandomTransaction(_random(3, 5), 200, 500, 10)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Транспорт',
      budget: 5000,
      icon: 'busOutline',
      transactions: [
        ...getRandomTransaction(_random(5, 10), 25, 25),
        ...getRandomTransaction(_random(5, 10), 110, 230, 10, 'Такси')
      ]
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Дом',
      budget: 10000,
      icon: 'homeOutline',
      transactions: [
        ..._compact(
          _times(months, time => {
            const dayX = 5
            if (time === 0 && !checkDayX(dayX)) return

            return transactionRepository.create({
              amount: getRandomNum(3000, 4500, 1),
              comment: 'Квартплата',
              date: moment().subtract(time, 'month').set('date', dayX)
            })
          })
        ),
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
      budget: 5000,
      icon: 'shirtOutline',
      transactions: getRandomTransaction(_random(1, 2), 2000, 5000, 100)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Развлечения',
      budget: 3000,
      icon: 'filmOutline',
      transactions: getRandomTransaction(_random(1, 3), 500, 1500, 100)
    }),
    categoryRepository.create({
      type: 'expense',
      name: 'Образование',
      budget: 8000,
      icon: 'schoolOutline',
      transactions: getRandomTransaction(_random(1, 2), 2000, 5000, 100)
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
      transactions: _compact(
        _times(months, time => {
          const dayX = 5
          if (time === 0 && !checkDayX(dayX)) return

          return transactionRepository.create({
            amount: 300,
            comment: 'За телефон',
            date: moment().subtract(time, 'month').set('date', dayX)
          })
        })
      )
    })
  ]

  await categoryRepository.save(categories)
  await Promise.all(
    categories.map(category => {
      const transactions = category.transactions.map(transaction => {
        transaction.categoryId = category.id
        if (moment.isMoment(transaction.date)) {
          transaction.date = (transaction.date as moment.Moment).toDate()
        }
        return transaction
      })

      return transactionRepository.save(transactions)
    })
  )
}

function checkDayX(date = 5) {
  const now = moment()
  const dayX = moment().set('date', date).startOf('day')
  return !now.isBefore(dayX)
}

function getRandomNum(min: number, max: number, round = 1) {
  return Math.round(_random(min, max) / round) * round
}

function getRandomDate(from: moment.Moment, to?: moment.Moment) {
  to = to || moment()
  const start = from.toDate()
  const end = to.toDate()

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

interface Migration {
  category: Category
  transactions?: Transaction[]
}
