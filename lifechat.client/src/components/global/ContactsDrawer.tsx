import { useTheme } from '@emotion/react';
import { ChevronLeft } from '@mui/icons-material';
import { Box, colors, Drawer, IconButton, Typography } from '@mui/material';
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
  const [channels, setChannels] = useState([])

  const isLoggedIn: boolean = useSelector(state => state.user.loggedIn)

  useEffect(() => {
    if(!isLoggedIn)
      return
    const subscription = HttpClient.get(`${apiUrl}Channels`)
      .subscribe({
        next(response) {
          setChannels(response)
        },
        error(err: Error) { console.error(err.message)},
        complete() {
          subscription.unsubscribe()
        }
      })
  }, [isLoggedIn])
  
  

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
        <Box display="flex" alignItems="center" height={`${ props.height ?? 5 }vh`} justifyContent="flex-end" bgcolor={theme.palette.background.dark}>
          <Typography variant="h3">
            Contacts
          </Typography>
          <IconButton onClick={() => toggleOpen()}>
            <ChevronLeft/>
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-start" paddingY="1vh" paddingLeft="0.5vw" height="100%" bgcolor={theme.palette.background.default}>
          { 
            channels.map((channel) => (
              <Typography onClick={() => {console.log(channel.name)}}
               variant="h5" width="95%" minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" display="flex"
               sx={{
                borderBottom: "solid",
                transition: "background-color 0.2s ease-out",
                ':hover': {
                  bgcolor: theme.palette.background.default
                }
              }}>
                  {channel.name}
              </Typography>
            ))
          }
          
        </Box>
    </Drawer>
  );
}
