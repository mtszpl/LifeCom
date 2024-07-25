import { useTheme } from '@emotion/react';
import { Add, ChevronLeft } from '@mui/icons-material';
import { Box, Divider, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HttpClient from '../../API/HttpClient';
import Channel from '../../model/Channel';
import Chat from '../../model/Chat';
import { useNavigate } from 'react-router-dom';
import { CreateChatDialog } from './CreateChatDialog';


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
  const [channels, setChannels] = useState<Channel[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, selectChat] = useState<Chat | string>('')
  const [chatCreatorOpen, setChatCreatorOpen] = useState<boolean>(false)

  const isLoggedIn: boolean = useSelector(state => state.userData.loggedIn)
  const navigate = useNavigate()


  useEffect(() => {
    if(!isLoggedIn)
      return
    getChats()

  }, [isLoggedIn])  

  const [drawerOpen, setDrawerOpen] = useState<boolean>(props.open)
  useEffect(() => setDrawerOpen(props.open), [props.open])

  //Getting channels on chat change
  useEffect(() => {
    setChannels([])
    navigate("")    
    if(selectedChat !== undefined && typeof selectedChat !== 'string')
      getChannels(selectedChat.id)
  }, [selectedChat])

  /**
   * Loads channels of chat from server
   * @param chatId Id of selected chat
   */
  const getChannels = (chatId: number) => {
    const channelsSubscription = HttpClient.get(`${apiUrl}Channels/bychat?chatId=${chatId}`)
    .subscribe({
      next(response) {
        console.log(response);
        if(response !== undefined)
          setChannels(response)
      },
      error(err: Error) { console.error(err.message)},
      complete() {
        channelsSubscription.unsubscribe()
      }
    })
  }

  /**
   * Loads chats of logged user
   */
  const getChats = () => {
    const chatSubscription = HttpClient.get(`${apiUrl}Chats`)
      .subscribe(({
        next(response) {
          setChats([...response]);
        },
        error(err: Error) { console.error(err.message); },
        complete() {
          chatSubscription.unsubscribe();
        }
      }));
  }

  const toggleOpen = () => {
    setDrawerOpen(!drawerOpen)
    if(props.handleClose !== undefined)
      props.handleClose(!drawerOpen)
  }

  const handleChannelSelect = (channel: Channel) => {
    navigate(`channel/${channel.id}`)    
  }
  
  const handleChatSelect = (e: SelectChangeEvent) => {
    if(typeof e.target.value === 'string'){
      if(e.target.value === "Add"){
        openChatCreator()
      }
      selectChat(e.target.value)
      return
    }
    selectChat(e.target.value)
    setChatCreatorOpen(false)
  }
  
  const header = () => {
    return (
      <Box display="flex" alignItems="center" height={`${ props.height ?? 5 }vh`} padding="1vh" justifyContent="flex-end" bgcolor={theme.palette.background.dark}>
        <Typography variant="h3">
          Contacts
        </Typography>
        <IconButton onClick={() => toggleOpen()}>
          <ChevronLeft/>
        </IconButton>
    </Box>
    )
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
              <MenuItem value="None">
                <Typography>
                  None
                </Typography>
              </MenuItem>
              <Divider/>
              {
                chats.map((chat, idx) => (
                    <MenuItem value={chat} key={idx}>
                      <Typography>
                        {chat.name}
                      </Typography>
                    </MenuItem>
                ))
              }
              <Divider/>
              <MenuItem value="Add" sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Typography>Add</Typography>
                <Add/>
              </MenuItem>
          </Select>
        </Box>
      </FormControl>
    )
  }

  function openChatCreator() {
    setChatCreatorOpen(true)
  }

  const createChat = (name: string) => {
    setChatCreatorOpen(false)
    getChats()
    selectChat(name)
  }

  return (
    <Drawer
      sx={{
        width: `${props.width}vw`,
        flexShrink: 0,
        bgcolor: theme.palette.background.default,
        '& .MuiDrawer-paper': {
          width: `${props.width}vw`,
          boxSizing: "border-box",
          transition: `width ${props.transitionTime ?? 800}ms ease-out`
        }
      }}
      variant="persistent"
      anchor="left"
      open={props.open}
      transitionDuration={props.transitionTime !== undefined ? props.transitionTime : 300}
      >
        {header()}
        {chatSelect()}
        <CreateChatDialog open={chatCreatorOpen} return={createChat}/>
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

