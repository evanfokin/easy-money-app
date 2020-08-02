import 'react-hot-loader'
import 'reflect-metadata'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import moment from 'moment'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

moment.locale('ru')
OfflinePluginRuntime.install({
  onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
  onUpdated: () => window.location.reload()
})

const [, theme] = window.location.search.match(/theme=(.+?)(?:&|$)/) || []
document.querySelector('body').setAttribute('theme', ['light', 'dark'].includes(theme) ? theme : null)

ReactDOM.render(<App />, document.getElementById('root'))
