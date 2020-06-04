import { Category } from '../../entities/Category'
import { Transaction } from '../../entities/Transaction'
import _sum from 'lodash/sum'
import _sumBy from 'lodash/sumBy'
import _orderBy from 'lodash/orderBy'
import _uniqBy from 'lodash/uniqBy'
import React from 'react'
import { TransactionType } from '../../helpers/transaction-type'

export class DashboardCardBase<P extends BaseProps = BaseProps, S = {}> extends React.Component<P, S> {
  get categories () {
    const uniq = _uniqBy(this.props.transactions, 'categoryId')
    return uniq.map(t => {
      const category = Object.assign(new Category(), t.category)
      category.transactions = this.props.transactions.filter(({ categoryId }) => categoryId === t.categoryId)
      return category
    })
  }

  getTopCategories (type?: TransactionType) {
    const categories = [...this.categories]
      .filter(category => !type || category.type === type)

    return _orderBy(categories, [c => this.getCategorySum(c)], ['desc'])
  }

  getCategoriesSum (categories: Category[]) {
    return _sum(categories.map(c => this.getCategorySum(c)))
  }

  getCategorySum (category: Category) {
    return this.getTransactionSum(category.transactions)
  }

  getTransactionSum (transactions: Transaction[]) {
    return _sumBy(transactions, 'amount')
  }
}

interface BaseProps {
  transactions: Transaction[],
}
