
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'
import deepstream from 'deepstream.io-client-js'

import App from './containers/App'
import configure from './store'

const ds = deepstream( 'localhost:6020' )
const uid = ds.getUid()
const username = 'iMsg-' + uid
console.log(username)
ds.login({ username: username })

var list = ds.record.getList('users')
var conversations = ds.record.getList('user/'+uid+'/conversations')

const store = configure()

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
