import React from 'react'
import {
  IonBadge,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemGroup,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonProgressBar,
  IonText,
  IonTitle,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import { getRepository } from 'typeorm'
import { Transaction } from '../../entities/Transaction'
import { add, remove, trashOutline } from 'ionicons/icons'
import _orderBy from 'lodash/orderBy'
import _groupBy from 'lodash/groupBy'
import moment from 'moment'
import { formatNumber } from '../../helpers/format-number'

class TransactionsPage extends React.Component<Props, State> {
  static transactionsChunk = 10

  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      visibleSize: TransactionsPage.transactionsChunk,
      loading: false
    }
  }

  transactionsRepo = getRepository(Transaction)

  ionViewWillEnter() {
    return this.fetch()
  }

  ionViewWillLeave() {
    this.setState({
      transactions: this.state.transactions.splice(0, TransactionsPage.transactionsChunk),
      visibleSize: TransactionsPage.transactionsChunk
    })
  }

  async fetch() {
    this.setState({ loading: true })

    const transactions = _orderBy(
      await this.transactionsRepo.find({ where: { deletedAt: null }, relations: ['category'] }),
      ['date'],
      ['desc']
    )

    this.setState({ transactions })
    this.setState({ loading: false })
  }

  async remove(id: string) {
    const deletedAt = new Date()
    await this.transactionsRepo.update(id, { deletedAt, updatedAt: deletedAt })
    await this.fetch()
  }

  get visibleTransactions() {
    return this.state.transactions.slice(0, this.state.visibleSize)
  }

  get groupedTransactions() {
    return _groupBy(this.visibleTransactions, transaction => {
      const date = moment(transaction.date)
      const isToday = date.isSame(moment(), 'day')
      const isYesterday = date.isSame(moment().subtract(1, 'day'), 'day')

      return isToday ? 'Сегодня' : isYesterday ? 'Вчера' : date.format('DD.MM.YYYY')
    })
  }

  get disableInfiniteScroll() {
    return this.visibleTransactions.length >= this.state.transactions.length
  }

  showNext($event: CustomEvent<void>) {
    this.setState({ visibleSize: this.state.visibleSize + 10 })
    ;($event.target as HTMLIonInfiniteScrollElement).complete().then()
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Транзакции</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Транзакции</IonTitle>
            </IonToolbar>
          </IonHeader>
          {this.state.loading ? <IonProgressBar type="indeterminate" /> : null}
          <IonList style={{ marginBottom: 100 }}>
            {Object.keys(this.groupedTransactions).map(title => (
              <IonItemGroup key={title}>
                <IonListHeader>
                  <IonLabel>{title}</IonLabel>
                </IonListHeader>
                {this.groupedTransactions[title].map(transaction => (
                  <IonItemSliding key={transaction.id}>
                    <IonItemOptions side="start">
                      <IonItemOption color="danger" onClick={() => this.remove(transaction.id)}>
                        <IonIcon slot="icon-only" icon={trashOutline} size={'small'} />
                      </IonItemOption>
                    </IonItemOptions>
                    <IonItem routerLink={`/transactions/${transaction.category.type}/${transaction.id}`}>
                      <IonIcon slot={'start'} icon={transaction.category.ionIcon} />
                      <IonLabel>{transaction.comment || transaction.category.name}</IonLabel>
                      <IonBadge color={transaction.category.type === 'income' ? 'success' : 'danger'} slot="end">
                        {formatNumber(transaction.amount)}
                      </IonBadge>
                    </IonItem>
                  </IonItemSliding>
                ))}
                <IonItem>
                  <IonNote style={{ fontSize: 12 }}>
                    {(() => {
                      const transactions = this.groupedTransactions[title]
                      let total = 0

                      transactions.forEach(transaction => {
                        if (transaction.category.type === 'income') total += transaction.amount
                        else total -= transaction.amount
                      })

                      return (
                        <>
                          <IonText style={{ marginRight: 5 }}>Подытог:</IonText>
                          <IonText color={total >= 0 ? 'success' : 'danger'}>{formatNumber(Math.abs(total))}</IonText>
                        </>
                      )
                    })()}
                  </IonNote>
                </IonItem>
              </IonItemGroup>
            ))}
          </IonList>

          <IonInfiniteScroll
            threshold="100px"
            disabled={this.disableInfiniteScroll}
            onIonInfinite={(e: CustomEvent<void>) => this.showNext(e)}
          >
            <IonInfiniteScrollContent loadingText="Загрузка..."></IonInfiniteScrollContent>
          </IonInfiniteScroll>

          <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ margin: 10 }}>
            <IonFabButton>
              <IonIcon icon={add} />
            </IonFabButton>
            <IonFabList side="top">
              <IonFabButton color={'danger'} routerLink={'/transactions/expense/add'}>
                <IonIcon icon={remove} />
              </IonFabButton>
              <IonFabButton color={'success'} routerLink={'/transactions/income/add'}>
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFabList>
          </IonFab>
        </IonContent>
      </IonPage>
    )
  }
}

interface Props {}

interface State {
  transactions: Transaction[]
  loading: boolean
  visibleSize: number
}

export default withIonLifeCycle(TransactionsPage)
