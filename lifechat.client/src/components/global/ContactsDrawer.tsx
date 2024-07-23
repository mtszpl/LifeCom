import { useTheme } from '@emotion/react';
import { ChevronLeft } from '@mui/icons-material';
import { Box, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HttpClient from '../../API/HttpClient';
import Channel from '../../model/Channel';
import Chat from '../../model/Chat';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../Theme';


interface IDrawerProps {
  open: boolean
  width: number 
  height?: number
  transitionTime? : number
  handleClose?: (newState: boolean) => void
}

export function ContactsDrawer (props: IDrawerProps) {

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const apiUrl: string = "https://localhost:7078/api/"
  const [channels, setChannels] = useState<Channel[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, selectChat] = useState<string>("None")

  const isLoggedIn: boolean = useSelector(state => state.user.loggedIn)
  const navigate = useNavigate()

  useEffect(() => {
    if(!isLoggedIn)
      return
    const subscription = HttpClient.get(`${apiUrl}Channels`)
      .subscribe({
        next(response) {
          if(response !== undefined)
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

  function handleChannelSelect(channel: Channel) {
    navigate(`channel/${channel.id}`)    
  }

  const header = () => {
    return (
      <Box display="flex" alignItems="center" height={`${ props.height ?? 5 }vh`} justifyContent="flex-end" bgcolor={theme.palette.background.dark}>
      <Typography variant="h3">
        Contacts
      </Typography>
      <IconButton onClick={() => toggleOpen()}>
        <ChevronLeft/>
      </IconButton>
    </Box>
    )
  }

  const handleChatSelect = (e: SelectChangeEvent) => {

  }

  const chatSelect = () => {
    return (
      <FormControl fullWidth variant="filled">
        <Box borderBottom="solid" bgcolor={theme.palette.primary.main}>
          <InputLabel>Chat</InputLabel>
          <Select 
            label="Chat"
            value={selectedChat}
            onChange={e => handleChatSelect(e)}
            sx={{
              textAlign: "left",
              width: "95%",
              marginBottom: "1vh",
              color: theme.palette.secondary.main
            }}>
            <MenuItem value="None">None</MenuItem>
            <MenuItem>Chats</MenuItem>
          </Select>
        </Box>
      </FormControl>
    )
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
        {header()}
        {chatSelect()}
        <Box display="flex" flexDirection="column" alignItems="flex-start" paddingY="1vh" paddingLeft="0.5vw" height="100%" bgcolor={theme.palette.background.default}>
          { 
            channels.map((channel, idx) => (
              <Box key={idx} width="95%" minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" display="flex"
                sx={{
                  borderBottom: "solid",
                  transition: "background-color 0.2s ease-out",
                  ':hover': {
                    bgcolor: theme.palette.background.dark,
                  }
                }}
                onClick={() => {
                  handleChannelSelect(channel)
                  props.handleChannelSelect?.(channel)
                }}
                >              
                <Typography
                  variant="h5">
                    {channel.name}
                </Typography>
              </Box>
            ))
          }
          
        </Box>
    </Drawer>
  );
}
