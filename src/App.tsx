import 'react-hot-loader'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import {
  getConfig,
  IonApp,
  IonContent,
  IonIcon,
  IonLoading,
  IonPage,
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
import './theme/dark-variables.scss'

import { Redirect, Route } from 'react-router'
import { albums, home, settings } from 'ionicons/icons'
import { IonReactRouter } from '@ionic/react-router'
import { createConnection } from './helpers/connection'
import DashboardPage from './pages/dashboard/DashboardPage'
import SettingsPage from './pages/settings/SettingsPage'
import CategoriesPage from './pages/settings/CategoriesPage'
import CategoryEditPage from './pages/settings/CategoryEditPage'
import TransactionsPage from './pages/transactions/TransactionsPage'
import TransactionEditPage from './pages/transactions/TransactionEditPage'
import AccountLoginPage from './pages/settings/AccountLoginPage'
import AccountSignUpPage from './pages/settings/AccountSignUpPage'
import AboutPage from './pages/settings/AboutPage'
import { sync } from './helpers/api'
import { addSampleData } from './helpers/migration'

const [, mode] = window.location.search.match(/mode=(.+?)(?:&|$)/) || []

if (!getConfig()) {
  setupConfig({
    swipeBackEnabled: false,
    backButtonText: 'Назад',
    mode: ['ios', 'md'].includes(mode) ? (mode as 'ios' | 'md') : 'ios'
  })
}

const initPromise = new Promise(async resolve => {
  await createConnection()
  await sync(3000).catch(e => console.error(e))

  if (!localStorage['firstSample']) {
    await addSampleData()
    localStorage['firstSample'] = 1
  }

  resolve()
})

class App extends React.Component<any, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }

    initPromise.then(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <IonApp>
        {this.state.loading ? (
          <IonPage>
            <IonContent fullscreen>
              <IonLoading isOpen />
            </IonContent>
          </IonPage>
        ) : (
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet animated={true}>
                <Route path={'/dashboard'} component={DashboardPage} exact />
                <Route path={`/transactions`} component={TransactionsPage} exact />
                <Route path={`/transactions/:type/add`} component={TransactionEditPage} exact />
                <Route path={`/transactions/:type/:id`} component={TransactionEditPage} exact />
                <Route path={`/settings`} component={SettingsPage} exact />
                <Route path={`/settings/categories/:type`} component={CategoriesPage} exact />
                <Route path={`/settings/categories/:type/add`} component={CategoryEditPage} exact />
                <Route path={`/settings/categories/:type/:id`} component={CategoryEditPage} exact />
                <Route path={`/settings/account/login`} component={AccountLoginPage} exact />
                <Route path={`/settings/account/sign-up`} component={AccountSignUpPage} exact />
                <Route path={`/settings/about`} component={AboutPage} exact />
                <Redirect from="/" to="/dashboard" exact={true} />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="dashboard" href="/dashboard">
                  <IonIcon icon={home} size={'small'} />
                </IonTabButton>
                <IonTabButton tab="transactions" href="/transactions">
                  <IonIcon icon={albums} size={'small'} />
                </IonTabButton>
                <IonTabButton tab="settings" href="/settings">
                  <IonIcon icon={settings} size={'small'} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        )}
      </IonApp>
    )
  }
}

interface State {
  loading: boolean
}

export default hot(App)
