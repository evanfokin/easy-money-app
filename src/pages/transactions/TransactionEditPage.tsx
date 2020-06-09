import React from 'react'
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import { RouteComponentProps } from 'react-router'
import { getRepository } from 'typeorm'
import { TransactionType } from '../../helpers/transaction-type'
import { Transaction } from '../../entities/Transaction'
import { Category } from '../../entities/Category'

class TransactionEditPage extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      form: this.getFormTransaction(),
      categories: [],
      loading: false,
      saveError: false
    }
  }

  categoriesRepo = getRepository(Category)
  transactionsRepo = getRepository(Transaction)

  get id () {
    return this.props.match.params.id
  }

  get type () {
    return this.props.match.params.type
  }

  get isNew () {
    return !this.id
  }

  setForm (value: Partial<Transaction>) {
    return this.setState({ form: { ...this.state.form, ...value } })
  }

  getFormTransaction () {
    const transaction = new Transaction()
    transaction.date = new Date()
    return transaction
  }

  async ionViewWillEnter () {
    this.setForm(this.getFormTransaction())

    if (!this.isNew) {
      this.setState({ loading: true })
      this.setForm(await this.transactionsRepo.findOne(this.id))
      this.setState({ loading: false })
    }

    this.setState({ categories: await this.categoriesRepo.find({ type: this.type }) })
  }

  async save () {
    const result = await this.transactionsRepo.save({ ...this.state.form })
      .catch(() => this.setState({ saveError: true }))
    if (!result) return

    this.props.history.replace(`/transactions`)
  }

  render () {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={'/transactions'}/>
            </IonButtons>
            <IonTitle>
              {this.isNew ? 'Создание' : 'Изменение'}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => this.save()}>
                Сохранить
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading
            isOpen={this.state.loading}
            message={'Загрузка...'}
          />
          <IonAlert
            isOpen={this.state.saveError}
            onDidDismiss={() => this.setState({ saveError: false })}
            header={'Ошибка сохранения'}
            message={'Проверьте данные'}
            buttons={['OK']}
          />
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Сумма</IonLabel>
              <IonInput value={this.state.form.amount}
                        type="tel"
                        onIonChange={e => {
                          const value = parseInt(e.detail.value)
                          return this.setForm({ amount: Number.isNaN(value) ? null : value })
                        }}/>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Дата</IonLabel>
              <IonDatetime value={this.state.form.date.toString()}
                           displayFormat={'DD.MM.YYYY'}
                           onIonChange={e => this.setForm({ date: new Date(e.detail.value) })}
                           cancelText={'Отмена'} doneText={'Подтвердить'}/>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Комментарий</IonLabel>
              <IonInput value={this.state.form.comment}
                        onIonChange={e => this.setForm({ comment: e.detail.value })}/>
            </IonItem>


            <IonList style={{ marginTop: 10 }}>
              {this.state.categories.map(category => (
                <IonItem key={category.id}
                         onClick={() => this.setForm({ categoryId: category.id })}
                         style={{ opacity: this.state.form.categoryId === category.id ? 1 : 0.4, padding: 0 }}>
                  <IonIcon icon={category.ionIcon} slot={'start'}/>
                  <IonLabel>{category.name}</IonLabel>
                </IonItem>
              ))
              }
            </IonList>

          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

interface Props extends RouteComponentProps<{ id: string, type: TransactionType }> {

}

interface State {
  form: Partial<Transaction>,
  categories: Category[],
  loading: boolean,
  saveError: boolean
}

export default withIonLifeCycle(TransactionEditPage)
