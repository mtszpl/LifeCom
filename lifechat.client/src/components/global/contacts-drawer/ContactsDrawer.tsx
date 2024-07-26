import { useTheme } from '@emotion/react';
import { Add } from '@mui/icons-material';
import { Box, Drawer, SelectChangeEvent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HttpClient from '../../../API/HttpClient';
import Channel from '../../../model/Channel';
import Chat from '../../../model/Chat';
import { useNavigate } from 'react-router-dom';
import { CreateChatDialog } from './CreateChatDialog';
import { DrawerHeader } from './DrawerHeader';
import { ChatSelector } from './ChatSelector';
import { ChannelsSelection } from './ChannelsSelection';
import { CreateChannelDialog } from './CreateChannelDialog';


interface IDrawerProps {
  open: boolean
  width: number 
  height?: number
  transitionTime? : number
  handleClose?: (newState: boolean) => void
}

export function ContactsDrawer (props: IDrawerProps) {

  const theme = useTheme()
  const noChatTuple = {
    chat: undefined,
    role: "None"
  }

  const apiUrl: string = "https://localhost:7078/api/"
  const [channels, setChannels] = useState<Channel[]>([])
  const [chats, setChats] = useState<{chat: Chat, role: string}[]>([])
  const [selectedChatTuple, selectChat] = useState<{chat: Chat | undefined, role: string}>(noChatTuple)
  const [chatCreatorOpen, setChatCreatorOpen] = useState<boolean>(false)
  const [channelCreatorOpen, setChannelCreatorOpen] = useState<boolean>(false)

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
    if(selectedChatTuple.chat !== undefined)
      getChannels(selectedChatTuple.chat.id)
  }, [selectedChatTuple])

  /**
   * Loads channels of chat from server
   * @param chatId Id of selected chat
   */
  const getChannels = (chatId: number) => {
    const channelsSubscription = HttpClient.get(`${apiUrl}Channels/bychat?chatId=${chatId}`)
    .subscribe({
      next(response) {
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
          // console.log(response)
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
    if(e.target.value.chat === undefined){
      if(e.target.value.role === "Add")
        setChatCreatorOpen(true)      
      selectChat(e.target.value)
      return
    }
    selectChat(e.target.value)
    setChatCreatorOpen(false)
  }

  const createChat = (name: string) => {
    setChatCreatorOpen(false)
    getChats()
    selectChat(name)
  }

  const createChannel = () => {
    setChannelCreatorOpen(false)
    if(selectedChatTuple !== undefined)
      getChannels(selectedChatTuple.chat.id)
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
        <DrawerHeader height={props.height} handleOpen={toggleOpen}/>
        <ChatSelector chatTuples={chats} selectedChat={selectedChatTuple} handleChatSelect={handleChatSelect}/>
        <CreateChatDialog open={chatCreatorOpen} handleCancel={() => {console.log("closing"); setChatCreatorOpen(false)}} handleReturn={createChat}/>
        <CreateChannelDialog open={channelCreatorOpen} handleCancel={() => {setChannelCreatorOpen(false)}} chat={selectedChatTuple} handleReturn={createChannel}/>
        <Box display="flex" flexDirection="column" alignItems="flex-start" paddingY="1vh" paddingLeft="0.5vw" height="100%" bgcolor={theme.palette.background.default}>
          <ChannelsSelection channels={channels} role={selectedChatTuple.role} handleChannelSelect={handleChannelSelect}/>          
        </Box>
    </Drawer>
  );
}

