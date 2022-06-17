import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import { useRoutes } from 'react-router-dom'
import Routes from './routes/routes'
import NavigationBar from './layout/NavigationBar'
import Container from '@mui/material/Container'

const App = () => {
    // helper hook to build the route componants from the Routes array
    const myRoutes = useRoutes(Routes)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavigationBar />
            <Container maxWidth="xl">{myRoutes}</Container>
        </ThemeProvider>
    )
}
export default App
