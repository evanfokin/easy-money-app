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
  IonNote
} from '@ionic/react'
import React from 'react'
import { formatNumber } from '../../helpers/format-number'

export class DashboardExpenseCard extends DashboardCardBase {
  get total () {
    return this.getCategoriesSum(
      this.getTopCategories('expense')
    )
  }

  render () {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>Вы потратили</IonCardSubtitle>
          <IonCardTitle>
            <IonLabel>{
              formatNumber(this.total)
            }</IonLabel>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonList>
            {
              this.getTopCategories('expense').map(c => (
                <IonItem key={c.id}>
                  <IonIcon slot={'start'} icon={c.ionIcon}/>
                  <IonLabel>{c.name}</IonLabel>
                  <IonNote slot={'end'}>{
                    formatNumber(this.getCategorySum(c))
                  }</IonNote>
                </IonItem>
              ))
            }
          </IonList>
        </IonCardContent>
      </IonCard>
    )
  }
}