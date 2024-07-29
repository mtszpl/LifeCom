import { useTheme } from '@emotion/react';
import { Drawer} from '@mui/material';
import { useEffect, useState } from 'react';
import Chat from '../../../model/Chat';
import { DrawerHeader } from './DrawerHeader';
import { ChatComponent } from './ChatComponents/ChatComponent';
import { ChannelsComponent } from './ChannelComponents/ChannelsComponent';


interface IDrawerProps {
  open: boolean
  width: number 
  height?: number
  transitionTime? : number
  handleClose?: (newState: boolean) => void
}

export function ContactsDrawer (props: IDrawerProps) {

  const noChatTuple = {
    chat: undefined,
    role: "None"
}

  const theme = useTheme()

  const [selectedChatTuple, setSelectedChatTuple] = useState<{chat: Chat | undefined, role: string}>(noChatTuple)


  const [drawerOpen, setDrawerOpen] = useState<boolean>(props.open)
  useEffect(() => setDrawerOpen(props.open), [props.open])

  //Getting channels on chat change
  const changeChat = (chatTuple: {chat: Chat | undefined, role: string}) => {    
    setSelectedChatTuple(chatTuple)    
  }

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
        <ChatComponent chatSelected={id => changeChat(id)}/>
        <ChannelsComponent selectedChatTuple={selectedChatTuple}/>    
    </Drawer>
  );
}

