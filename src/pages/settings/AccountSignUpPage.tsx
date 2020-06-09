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
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonTitle,
  IonToast,
  IonToolbar,
  withIonLifeCycle
} from '@ionic/react'
import React from 'react'
import { helpCircleOutline, lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons'
import { signUp } from '../../helpers/api'

export class AccountSignUpPage extends React.Component<any, State> {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      showToast: false,
      passwordPopover: {
        show: false,
        event: undefined
      }
    }
  }

  ionViewWillEnter () {
    this.resetForm()
  }

  resetForm () {
    this.setState({
      name: '',
      email: '',
      password: ''
    })
  }

  async submit () {
    try {
      await signUp(this.state)
      this.props.history.push('/settings')
    } catch (e) {
      console.error(e)
      this.setState({ showToast: true })
    }
  }

  render () {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={'/settings'}/>
            </IonButtons>
            <IonTitle>Регистрация</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>

          <IonToast
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            header={'Ошибка регистрации'}
            message="Проверьте данные"
            duration={1000}
          />

          <IonList>
            <IonItemGroup>
              <IonItem>
                <IonIcon slot="start" icon={personOutline} size={'small'}/>
                <IonInput value={this.state.name}
                          placeholder={'Имя'}
                          onIonChange={e => this.setState({ name: e.detail.value! })}/>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={mailOutline} size={'small'}/>
                <IonInput value={this.state.email}
                          type={'email'}
                          placeholder={'Email'}
                          onIonChange={e => this.setState({ email: e.detail.value! })}/>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={lockClosedOutline} size={'small'}/>
                <IonInput value={this.state.password}
                          type={'password'}
                          placeholder={'Пароль'}
                          onIonChange={e => this.setState({ password: e.detail.value! })}/>
                <IonIcon slot={'end'} icon={helpCircleOutline} size={'small'}
                         onClick={e => this.setState({ passwordPopover: { show: true, event: e.nativeEvent } })}/>
                <IonPopover translucent
                            isOpen={this.state.passwordPopover.show}
                            event={this.state.passwordPopover.event}
                            onDidDismiss={() => this.setState({ passwordPopover: { show: false, event: undefined } })}>
                  <IonList>
                    <IonItem>
                      <IonLabel>
                        от 5 символов
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonPopover>

              </IonItem>
              <IonButton expand={'block'} onClick={() => this.submit()}
                         style={{ margin: 15 }}>
                Зарегистрироваться
              </IonButton>
            </IonItemGroup>
          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

interface State {
  name: string
  email: string,
  password: string,
  showToast: boolean,
  passwordPopover: {
    show: boolean,
    event?: any
  }
}

export default withIonLifeCycle(AccountSignUpPage)
