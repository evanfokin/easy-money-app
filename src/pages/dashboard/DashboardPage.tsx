import React from 'react'
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import { RouteComponentProps } from 'react-router'
import { getRepository } from 'typeorm'
import { Transaction } from '../../entities/Transaction'
import moment from 'moment'
import { calendar } from 'ionicons/icons'
import { DashboardExpenseCard } from './DashboardExpenseCard'
import { DashboardIncomeCard } from './DashboardIncomeCard'
import { ModalParameters } from './interfaces/modal-parameters'
import { DashboardFiltersModal } from './DashboardFiltersModal'

class DashboardPage extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      showModal: false,
      transactions: [],
      filter: {
        from: moment().startOf('month').toDate(),
        to: moment().endOf('month').toDate()
      }
    }
  }

  transactionsRepo = getRepository(Transaction)

  ionViewWillEnter () {
    return this.fetch()
  }

  async fetch () {
    this.setState({ loading: true })
    const transactions = await this.transactionsRepo.find({ where: { deletedAt: null }, relations: ['category'] })
    this.setState({ transactions })
    this.setState({ loading: false })
  }

  setFilter (value: Partial<State['filter']>) {
    return this.setState({ filter: { ...this.state.filter, ...value } })
  }

  get filteredTransactions () {
    const { transactions, filter } = this.state
    return transactions
      .filter(transaction => {
        const date = moment(transaction.date).toDate()
        return (date >= filter.from && date <= filter.to)
      })
  }

  get months (): number {
    const { filter } = this.state
    const from = moment(filter.from)
    const to = moment(filter.to).add(1, 'seconds')

    return to.diff(from, 'months', true)
  }

  render () {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Аналитика</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Аналитика</IonTitle>
            </IonToolbar>
          </IonHeader>
          <DashboardFiltersModal filter={this.state.filter}
                                 showModal={this.state.showModal}
                                 onChange={e => this.setFilter(e)}
                                 onClose={() => this.setState({ showModal: false })}/>

          <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ margin: 10 }}>
            <IonFabButton onClick={() => this.setState({ showModal: true })}>
              <IonIcon icon={calendar}/>
            </IonFabButton>
          </IonFab>

          <div style={{ marginBottom: 100 }}>
            <DashboardIncomeCard transactions={this.filteredTransactions} months={this.months}/>
            <DashboardExpenseCard transactions={this.filteredTransactions} months={this.months}/>
          </div>

        </IonContent>
      </IonPage>
    )
  }
}

interface Props extends RouteComponentProps<{}> {

}

interface State extends ModalParameters {
  transactions: Transaction[],
  loading: boolean
}

export default withIonLifeCycle(DashboardPage)
