import React from 'react'
import {
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonListHeader,
  IonNote,
  IonSpinner,
  withIonLifeCycle
} from '@ionic/react'
import { cloudOutline, fingerPrintOutline, logOutOutline, personCircleOutline, personOutline } from 'ionicons/icons'
import { api, isLoggedIn, removeAuthToken, sync } from '../../helpers/api'
import delay from 'delay'

export class Account extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      synchronization: false,
      isLoggedIn: false,
      user: null
    }
  }

  async componentDidMount() {
    await this.check()
  }

  getSnapshotBeforeUpdate(prevProps: Props) {
    if (!this.state.loading && prevProps.ready && !this.props.ready) {
      this.check().then()
    }

    return null
  }

  async check() {
    this.setState({ loading: true })

    const status = await isLoggedIn()
    let user = null

    if (status) {
      user = (await api.get('/users/me')).data
    }

    if (this.props.onReady) this.props.onReady()
    this.setState({ loading: false, isLoggedIn: status, user })
  }

  async logOut() {
    removeAuthToken()
    await this.check()
  }

  async sync() {
    if (this.state.synchronization) return

    this.setState({ synchronization: true })
    await sync()
    await delay(1000)
    this.setState({ synchronization: false })
  }

  render() {
    return (
      <IonItemGroup>
        <IonListHeader>
          <IonLabel>Аккаунт</IonLabel>
        </IonListHeader>
        {!this.state.isLoggedIn ? (
          <>
            <IonItem routerLink={'/settings/account/login'}>
              <IonIcon slot="start" icon={fingerPrintOutline} />
              <IonLabel>Войти</IonLabel>
            </IonItem>
            <IonItem routerLink={'/settings/account/sign-up'}>
              <IonIcon slot="start" icon={personOutline} />
              <IonLabel>Регистрация</IonLabel>
            </IonItem>
          </>
        ) : (
          <>
            {this.state.user ? (
              <IonItem detail={false}>
                <IonIcon slot="start" icon={personCircleOutline} />
                <IonLabel>{this.state.user.name}</IonLabel>
                <IonNote slot={'end'}>{this.state.user.email}</IonNote>
              </IonItem>
            ) : null}
            <IonItem
              button={!this.state.synchronization}
              detail={!this.state.synchronization}
              onClick={() => this.sync()}
            >
              {!this.state.synchronization ? (
                <>
                  <IonIcon slot="start" icon={cloudOutline} />
                  <IonLabel>Синхронизировать</IonLabel>
                </>
              ) : (
                <>
                  <IonSpinner slot="start" name="crescent" />
                  <IonNote>Синхронизация...</IonNote>
                </>
              )}
            </IonItem>
            <IonItem button onClick={() => this.logOut()}>
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Выйти</IonLabel>
            </IonItem>
          </>
        )}
      </IonItemGroup>
    )
  }
}

interface Props {
  ready: boolean
  onReady?: Function
}

interface State {
  loading: boolean
  isLoggedIn: boolean
  synchronization: boolean
  user?: {
    name: string
    email: string
  }
}

export default withIonLifeCycle(Account)
