import React, { useState } from 'react'
import { ReactComponent as WeTransferLogo } from './we-transfer-logo.svg'
import { NavLink, Outlet, Link, useRoutes } from 'react-router-dom'
import Routes from './../routes/routes'

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    MenuList,
    MenuItem,
    ListItemText,
    Button,
    Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import Notifications from './Notifications'

const NavigationBar: React.FC = (props: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        setIsOpen(open)
    }

    const activeRoute = (routeName: any) => {
        return window.location.pathname === routeName ? true : false
    }

    return (
        <div>
            <div>
                <AppBar position="static" style={{ background: 'rgb(22, 22, 22)' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ pt: 1, mr: 1 }}>
                            <WeTransferLogo></WeTransferLogo>
                        </Box>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, pt: 1 }}>
                            NFT
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <Drawer open={isOpen} onClose={toggleDrawer(false)}>
                <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <MenuList>
                        {Routes.map((prop, key) => {
                            return (
                                <Link to={prop.path} style={{ textDecoration: 'none' }} key={key}>
                                    <MenuItem selected={activeRoute(prop.path)}>
                                        <ListItemText primary={prop.sidebarName} />
                                    </MenuItem>
                                </Link>
                            )
                        })}
                    </MenuList>
                </div>
            </Drawer>
            <Outlet></Outlet>
            <Notifications></Notifications>
        </div>
    )
}

export default NavigationBar
