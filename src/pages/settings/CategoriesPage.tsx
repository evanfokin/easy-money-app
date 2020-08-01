import React from 'react'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import { getRepository } from 'typeorm'
import { Category } from '../../entities/Category'
import { RouteComponentProps } from 'react-router'
import { TransactionType } from '../../helpers/transaction-type'
import { trashOutline } from 'ionicons/icons'
import { Transaction } from '../../entities/Transaction'

export class CategoriesPage extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      loading: false
    }
  }

  categoriesRepo = getRepository(Category)
  transactionsRepo = getRepository(Transaction)

  get type() {
    return this.props.match.params.type
  }

  ionViewWillEnter() {
    return this.fetch()
  }

  async fetch() {
    this.setState({ loading: true })
    this.setState({ categories: await this.categoriesRepo.find({ type: this.type, deletedAt: null }) })
    this.setState({ loading: false })
  }

  async remove(id: string) {
    const deletedAt = new Date()
    await this.transactionsRepo.update({ categoryId: id }, { deletedAt, updatedAt: deletedAt })
    await this.categoriesRepo.update(id, { deletedAt, updatedAt: deletedAt })
    await this.fetch()
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={'/settings'} />
            </IonButtons>
            <IonTitle>Список категорий</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink={`/settings/categories/${this.type}/add`}>Добавить</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={this.state.loading} message={'Загрузка...'} />
          <IonList>
            {this.state.categories.map(category => (
              <IonItemSliding key={category.id}>
                <IonItemOptions side="start">
                  <IonItemOption color="danger" onClick={() => this.remove(category.id)}>
                    <IonIcon slot="icon-only" icon={trashOutline} size={'small'} />
                  </IonItemOption>
                </IonItemOptions>
                <IonItem routerLink={`/settings/categories/${this.type}/${category.id}`}>
                  <IonIcon icon={category.ionIcon} slot="start" />
                  <IonLabel>{category.name}</IonLabel>
                </IonItem>
              </IonItemSliding>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

interface Props extends RouteComponentProps<{ type: TransactionType }> {}

interface State {
  categories: Category[]
  loading: boolean
}

export default withIonLifeCycle(CategoriesPage)
