import React from 'react'
import {
  IonAlert,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import { cardOutline, copyOutline, informationCircleOutline, trashOutline, walletOutline } from 'ionicons/icons'
import { addSampleData, wipe } from '../../helpers/migration'
import { AlertAction } from './enums/alert-action'
import { Account } from './Account'

class SettingsPage extends React.Component<any, State> {
  constructor(props) {
    super(props)
    this.state = {
      showAlert: false,
      alertAction: null,
      accountReady: false
    }
  }

  get ready() {
    return this.state.accountReady
  }

  showAlert(action: AlertAction) {
    this.setState({ showAlert: true, alertAction: action })
  }

  hideAlert() {
    this.setState({ showAlert: false, alertAction: null })
  }

  ionViewWillEnter() {
    this.setState({ accountReady: false })
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Настройки</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <IonAlert
            isOpen={this.state.showAlert}
            onDidDismiss={() => this.hideAlert()}
            header={'Вы уверены?'}
            message={
              this.state.alertAction === AlertAction.Clean
                ? 'Удалённые данные невозможно восстановить'
                : 'Это удалит все данные и заменит новыми'
            }
            buttons={[
              {
                text: 'Отмена',
                role: 'cancel',
                cssClass: 'secondary'
              },
              {
                text: 'Да',
                handler: () => (this.state.alertAction === AlertAction.Clean ? wipe() : addSampleData())
              }
            ]}
          />

          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Настройки</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList>
            <Account ready={this.state.accountReady} onReady={() => this.setState({ accountReady: true })} />
            <IonItemGroup>
              <IonListHeader>
                <IonLabel>Категории</IonLabel>
              </IonListHeader>
              <IonItem routerLink="/settings/categories/income">
                <IonIcon slot="start" icon={walletOutline} />
                <IonLabel>Доходы</IonLabel>
              </IonItem>
              <IonItem routerLink="/settings/categories/expense">
                <IonIcon slot="start" icon={cardOutline} />
                <IonLabel>Расходы</IonLabel>
              </IonItem>
            </IonItemGroup>

            <IonItemGroup>
              <IonListHeader>
                <IonLabel>Данные</IonLabel>
              </IonListHeader>
              <IonItem button onClick={() => this.showAlert(AlertAction.Sample)}>
                <IonIcon slot="start" icon={copyOutline} />
                <IonLabel>Заполнить тестовыми данными</IonLabel>
              </IonItem>
              <IonItem button onClick={() => this.showAlert(AlertAction.Clean)}>
                <IonIcon slot="start" color={'danger'} icon={trashOutline} />
                <IonLabel color={'danger'}>Удалить все данные</IonLabel>
              </IonItem>
            </IonItemGroup>

            <IonItemGroup>
              <IonListHeader>
                <IonLabel>Информация</IonLabel>
              </IonListHeader>
              <IonItem routerLink={'/settings/about'}>
                <IonIcon slot="start" icon={informationCircleOutline} />
                <IonLabel>О разработке</IonLabel>
              </IonItem>
            </IonItemGroup>
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

interface State {
  showAlert: boolean
  alertAction?: AlertAction
  accountReady: boolean
}

export default withIonLifeCycle(SettingsPage)
