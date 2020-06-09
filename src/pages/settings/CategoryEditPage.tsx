import React from 'react'
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import { Icons } from '../../helpers/icons'
import { Category } from '../../entities/Category'
import { RouteComponentProps } from 'react-router'
import { getRepository } from 'typeorm'
import { TransactionType } from '../../helpers/transaction-type'

class CategoryEditPage extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      form: new Category(),
      loading: false,
      saveError: false
    }
  }

  repo = getRepository(Category)

  get id () {
    return this.props.match.params.id
  }

  get type () {
    return this.props.match.params.type
  }

  get isNew () {
    return !this.id
  }

  setForm (value: Partial<Category>) {
    return this.setState({ form: { ...this.state.form, ...value } })
  }

  async ionViewWillEnter () {
    this.setForm(new Category())

    if (!this.isNew) {
      this.setState({ loading: true })
      this.setForm(await this.repo.findOne(this.id))
      this.setState({ loading: false })
    }
  }

  async save () {
    const result = await this.repo.save({ ...this.state.form, type: this.type })
      .catch(() => this.setState({ saveError: true }))
    if (!result) return

    this.props.history.replace(`/settings/categories/${this.type}`)
  }

  render () {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={`/settings/categories/${this.type}`}/>
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
              <IonLabel position="stacked">Название</IonLabel>
              <IonInput value={this.state.form.name}
                        onIonChange={e => this.setForm({ name: e.detail.value! })}/>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked" style={{ marginBottom: 20 }}>Иконка</IonLabel>
              <IonRow>
                {Object.keys(Icons.outline).map(key => (
                  <IonCol style={{ opacity: this.state.form.icon === key ? 1 : 0.4 }}
                          onClick={() => this.setForm({ icon: key })}
                          key={key}>
                    <IonIcon icon={Icons.outline[key]} style={{ fontSize: 40 }}/>
                  </IonCol>
                ))}
              </IonRow>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

interface Props extends RouteComponentProps<{ id: string, type: TransactionType }> {

}

interface State {
  form: Partial<Category>,
  loading: boolean,
  saveError: boolean
}

export default withIonLifeCycle(CategoryEditPage)
