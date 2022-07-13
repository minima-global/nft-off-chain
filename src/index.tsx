import React from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import App from './app/App'
import { store } from './state/store'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import Decimal from 'decimal.js'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <HashRouter>
                    <App />
                </HashRouter>
            </SnackbarProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
