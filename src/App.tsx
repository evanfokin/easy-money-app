import 'react-hot-loader'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import {
  IonApp,
  IonIcon,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupConfig
} from '@ionic/react'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
/* Theme variables */
import './theme/variables.css'
import { Redirect, Route } from 'react-router'
import { albums, home, settings } from 'ionicons/icons'
import { IonReactRouter } from '@ionic/react-router'
import { createConnection } from './helpers/connection'
import Dashboard from './pages/dashboard/Dashboard'
import SettingsList from './pages/settings/SettingsList'
import Categories from './pages/settings/Categories'
import CategoryEdit from './pages/settings/CategoryEdit'
import TransactionsList from './pages/transactions/TransactionsList'
import TransactionEdit from './pages/transactions/TransactionEdit'
import { About } from './pages/settings/About'

setupConfig({
  swipeBackEnabled: false,
  backButtonText: 'Назад',
  mode: 'ios',
})

const connectionPromise = createConnection()

const App: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true)
  connectionPromise.then(() => setShowLoading(false))

  return (
    <IonApp>
      {!showLoading
        ?
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet animated={true}>
              <Route path={'/dashboard'} component={Dashboard} exact/>
              <Route path={`/transactions`} component={TransactionsList} exact/>
              <Route path={`/transactions/:type/add`} component={TransactionEdit} exact/>
              <Route path={`/transactions/:type/:id`} component={TransactionEdit} exact/>
              <Route path={`/settings`} component={SettingsList} exact/>
              <Route path={`/settings/categories/:type`} component={Categories} exact/>
              <Route path={`/settings/categories/:type/add`} component={CategoryEdit} exact/>
              <Route path={`/settings/categories/:type/:id`} component={CategoryEdit} exact/>
              <Route path={`/settings/about`} component={About} exact/>
              <Redirect from="/" to="/dashboard" exact={true}/>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="dashboard" href="/dashboard">
                <IonIcon icon={home} size={'small'}/>
              </IonTabButton>
              <IonTabButton tab="transactions" href="/transactions">
                <IonIcon icon={albums} size={'small'}/>
              </IonTabButton>
              <IonTabButton tab="settings" href="/settings">
                <IonIcon icon={settings} size={'small'}/>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
        :
        <IonLoading
          isOpen={true}
          showBackdrop={false}
          message={'Загрузка...'}
        />
      }
    </IonApp>
  )
}

export default hot(App)
