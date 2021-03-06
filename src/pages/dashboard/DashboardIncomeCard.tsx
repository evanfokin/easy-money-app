import { DashboardCardBase } from './DashboardCardBase'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonProgressBar
} from '@ionic/react'
import React from 'react'
import { formatNumber } from '../../helpers/format-number'

export class DashboardIncomeCard extends DashboardCardBase {
  get total() {
    return this.getCategoriesSum(this.getTopCategories('income'))
  }

  render() {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>Вы заработали</IonCardSubtitle>
          <IonCardTitle>
            <IonLabel>{formatNumber(this.total)}</IonLabel>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonList>
            {this.getTopCategories('income').map(c => (
              <IonItem key={c.id} lines={'none'}>
                <IonIcon slot={'start'} icon={c.ionIcon} />
                <IonLabel>
                  <div style={{ marginBottom: 5 }}>{c.name}</div>
                  <IonProgressBar color="primary" value={this.getBudgetPercentage(c)} />
                </IonLabel>
                <IonNote slot={'end'}>{formatNumber(this.getCategorySum(c))}</IonNote>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    )
  }
}
