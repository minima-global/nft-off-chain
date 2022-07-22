import { useEffect, useState } from 'react'
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
import Decimal from 'decimal.js'
import { Backdrop, CircularProgress, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { pollMyOpenAuctions } from './../state/marketplace.state'

const App = () => {
    const dispatch = useAppDispatch()
    // helper hook to build the route componants from the Routes array
    const myRoutes = useRoutes(Routes)
    const [minimaLoaded, setMinimaLoaded] = useState(false)

    useEffect(() => {
        events.onInit(() => {
            console.log('****************** app init ***********************')
            setMinimaLoaded(true)

            events.onMaxima((maximaMessage) => {
                dispatch(processMaximaMessage(maximaMessage))
            })

            dispatch(pollMyOpenAuctions())
        })
    }, [])

    // Decimal.js is used to handle floating point numbers
    Decimal.set({ precision: 50 })

    if (minimaLoaded) {
        return (
            <>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <NavigationBar />
                    <Container maxWidth="xl">{myRoutes}</Container>
                </ThemeProvider>
            </>
        )
    } else {
        return (
            <>
                <Backdrop open={!minimaLoaded}>
                    <CircularProgress style={{ color: 'white' }} />
                </Backdrop>
            </>
        )
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NavigationBar />
                <Container maxWidth="xl">{myRoutes}</Container>

                <Backdrop open={!minimaLoaded}>
                    <CircularProgress />
                </Backdrop>
            </ThemeProvider>
        </>
    )
}
export default App
