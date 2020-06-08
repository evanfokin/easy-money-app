import 'react-hot-loader'
import 'reflect-metadata'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import moment from 'moment'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

moment.locale('ru')

ReactDOM.render(<App/>, document.getElementById('root'))

if (process.env.NODE_ENV === 'production') {
  OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => window.location.reload(),
  })
}
