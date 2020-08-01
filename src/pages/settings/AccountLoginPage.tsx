import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import React from 'react'
import { lockClosedOutline, mailOutline } from 'ionicons/icons'
import { login } from '../../helpers/api'
import { RouteComponentProps } from 'react-router'

export class AccountLoginPage extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      showToast: false
    }
  }

  ionViewWillEnter() {
    this.resetForm()
  }

  resetForm() {
    this.setState({
      email: '',
      password: ''
    })
  }

  async submit() {
    try {
      await login(this.state.email, this.state.password)
      this.props.history.push('/settings')
    } catch (e) {
      console.error(e)
      this.setState({ showToast: true })
    }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={'/settings'} />
            </IonButtons>
            <IonTitle>Авторизация</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <IonToast
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            header={'Ошибка авторизации'}
            message="Проверьте данные"
            duration={1000}
          />

          <IonList>
            <IonItemGroup>
              <IonItem>
                <IonIcon slot="start" icon={mailOutline} size={'small'} />
                <IonInput
                  value={this.state.email}
                  placeholder={'Email'}
                  type={'email'}
                  onIonChange={e => this.setState({ email: e.detail.value! })}
                />
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={lockClosedOutline} size={'small'} />
                <IonInput
                  value={this.state.password}
                  placeholder={'Пароль'}
                  type={'password'}
                  onIonChange={e => this.setState({ password: e.detail.value! })}
                />
              </IonItem>
              <IonButton expand={'block'} onClick={() => this.submit()} style={{ margin: 15 }}>
                Войти
              </IonButton>
            </IonItemGroup>
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

interface Props extends RouteComponentProps<{}> {}

interface State {
  email: string
  password: string
  showToast: boolean
}

export default withIonLifeCycle(AccountLoginPage)
