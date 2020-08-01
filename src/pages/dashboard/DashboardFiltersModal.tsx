import React from 'react'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import moment from 'moment'
import { ModalParameters } from './interfaces/modal-parameters'
import { Filter } from './interfaces/filter'

export class DashboardFiltersModal extends React.Component<Props, State> {
  onChange(value: Partial<Filter>) {
    if (!this.props.onChange) return

    const newValue = { ...this.props.filter, ...value }
    newValue.from = moment(newValue.from).startOf('day').toDate()
    newValue.to = moment(newValue.to).endOf('day').toDate()
    this.props.onChange(newValue)
  }

  onClose() {
    if (this.props.onClose) this.props.onClose()
  }

  changeDate(key: 'from' | 'to', e: any) {
    const date = new Date(e.detail.value)
    this.onChange({ [key]: date })
  }

  presets: Preset[] = [
    {
      name: 'Сегодня',
      config: [() => moment().startOf('day'), () => moment().endOf('day')]
    },
    {
      name: 'Вчера',
      config: [() => moment().subtract(1, 'day').startOf('day'), () => moment().subtract(1, 'day').endOf('day')]
    },
    {
      name: 'На этой неделе',
      config: [() => moment().startOf('week'), () => moment().endOf('week')]
    },
    {
      name: 'На прошлой неделе',
      config: [() => moment().subtract(1, 'week').startOf('week'), () => moment().subtract(1, 'week').endOf('week')]
    },
    {
      name: 'В этом месяце',
      config: [() => moment().startOf('month'), () => moment().endOf('month')]
    },
    {
      name: 'В прошлом месяце',
      config: [() => moment().subtract(1, 'month').startOf('month'), () => moment().subtract(1, 'month').endOf('month')]
    },
    {
      name: 'В этом году',
      config: [() => moment().startOf('year'), () => moment().endOf('year')]
    },
    {
      name: 'В прошлом году',
      config: [() => moment().subtract(1, 'year').startOf('year'), () => moment().subtract(1, 'year').endOf('year')]
    }
  ]

  setPreset(preset: Preset) {
    const [fromF, toF] = preset.config
    this.onChange({ from: fromF().toDate(), to: toF().toDate() })
    this.onClose()
  }

  render() {
    return (
      <IonModal isOpen={this.props.showModal} swipeToClose onDidDismiss={() => this.onClose()}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Фильтры</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => this.onClose()}>Закрыть</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonItemGroup>
              <IonListHeader>
                <IonLabel>Выберите период</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>Начальная дата</IonLabel>
                <IonDatetime
                  value={this.props.filter.from.toString()}
                  onIonChange={e => this.changeDate('from', e)}
                  displayFormat="DD.MM.YYYY"
                />
              </IonItem>
              <IonItem>
                <IonLabel>Конечная дата</IonLabel>
                <IonDatetime
                  value={this.props.filter.to.toString()}
                  onIonChange={e => this.changeDate('to', e)}
                  displayFormat="DD.MM.YYYY"
                />
              </IonItem>
            </IonItemGroup>
            <IonItemGroup>
              <IonListHeader>
                <IonLabel>Пресеты</IonLabel>
              </IonListHeader>

              {this.presets.map((preset, index) => (
                <IonItem key={index} button onClick={() => this.setPreset(preset)}>
                  <IonLabel>{preset.name}</IonLabel>
                </IonItem>
              ))}
            </IonItemGroup>
          </IonList>
        </IonContent>
      </IonModal>
    )
  }
}

interface Preset {
  name: string
  config: [() => moment.Moment, () => moment.Moment]
}

interface Props extends ModalParameters {
  onChange?: Function
  onClose?: Function
}

interface State {}
