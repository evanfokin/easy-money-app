import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import React from 'react'
import { giftOutline, personCircleOutline } from 'ionicons/icons'

export class About extends React.Component<any, State> {
  static secretVideoCode = 'DLzxrzFCyOs'

  constructor (props) {
    super(props)
    this.state = {
      easterEgg: false
    }
  }

  render () {
    return (
      <IonPage>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonTitle>О разработке</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <IonItemSliding>
            <IonItemOptions side="end">
              <IonItemOption color="primary"
                             onClick={() => this.setState({ easterEgg: true })}>
                <IonIcon slot="icon-only" icon={giftOutline} size={'small'}/>
              </IonItemOption>
            </IonItemOptions>
            <IonItem>
              <IonIcon slot={'start'} icon={personCircleOutline}/>
              <IonLabel>Автор: Иван Фокин</IonLabel>
            </IonItem>
          </IonItemSliding>
          {
            this.state.easterEgg ? (
              <div style={{ padding: 15 }}>
                <iframe src={`https://www.youtube.com/embed/${About.secretVideoCode}?autoplay=1&playsinline=1`}
                        title={'Easter Egg'}
                        width="720" height="288"
                        frameBorder="0"
                        allowFullScreen
                        style={{ width: '100%' }}/>
              </div>
            ) : null
          }
        </IonContent>
      </IonPage>
    )
  }
}

interface State {
  easterEgg: boolean
}
