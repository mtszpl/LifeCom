import { useTheme } from '@emotion/react';
import { ChevronLeft } from '@mui/icons-material';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HttpClient from '../../utility/HttpClient';


interface IDrawerProps {
  open: boolean
  width: number 
  height?: number
  transitionTime? : number
  handleClose?: (newState: boolean) => void
}

export function ContactsDrawer (props: IDrawerProps) {

  const theme = useTheme()

  const apiUrl: string = "https://localhost:7078/api/"
  const [channels, setChannels] = useState()

  const isLoggedIn: boolean = useSelector(state => state.user.loggedIn)

  useEffect(() => {
    console.log(`IsLogged: ${isLoggedIn}`);
    if(!isLoggedIn)
      return
    HttpClient.get(`${apiUrl}Channels`)
      .subscribe({
        next(response) {
          console.log(response);
        },
        error(err: Error) { console.error(err.message)},
        complete() {}
      })
  }, [])
  

  const [drawerOpen, setDrawerOpen] = useState<boolean>(props.open)
  useEffect(() => setDrawerOpen(props.open), [props.open])

  const toggleOpen = () => {
    setDrawerOpen(!drawerOpen)
    if(props.handleClose !== undefined)
      props.handleClose(!drawerOpen)
  }

  return (
    <Drawer
      sx={{
        width: `${props.width}vw`,
        flexShrink: 0,
        bgcolor: theme.palette.background.default,
        '& .MuiDrawer-paper': {
          width: `${props.width}vw`,
          boxSizing: "border-box"
        }
      }}
      variant="persistent"
      anchor="left"
      open={props.open}
      transitionDuration={props.transitionTime !== undefined ? props.transitionTime : 300}
      >
        <Box display="flex" alignItems="center" height={`${ props.height ?? 5 }vh`} justifyContent="flex-end" bgcolor={theme.palette.background.default}>
          <Typography variant="h3">
            Contacts
          </Typography>
          <IconButton onClick={() => toggleOpen()}>
            <ChevronLeft/>
          </IconButton>
        </Box>
        <Box display="flex" alignItems="flex-start" height="100%" bgcolor={theme.palette.background.dark}>
          eee
        </Box>
    </Drawer>
  );
}
