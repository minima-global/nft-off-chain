import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import { useRoutes } from 'react-router-dom'
import Routes from './routes/routes'
import NavigationBar from './layout/NavigationBar'
import Container from '@mui/material/Container'
import { events } from '../minima'
import { useAppDispatch } from '../state/hooks'
import { processMaximaMessage } from '../state/swapcontract.state'

const App = () => {
    const dispatch = useAppDispatch()
    // helper hook to build the route componants from the Routes array
    const myRoutes = useRoutes(Routes)

    useEffect(() => {
        events.onMaxima((maximaMessage) => {
            dispatch(processMaximaMessage(maximaMessage))
        })
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavigationBar />
            <Container maxWidth="xl">{myRoutes}</Container>
        </ThemeProvider>
    )
}
export default App
