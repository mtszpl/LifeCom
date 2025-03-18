import * as React from 'react';
import { ChatSelector } from './ChatSelector';
import { CreateChatDialog } from './CreateChatDialog';
import Chat from '../../../../model/Chat';
import { Box, SelectChangeEvent } from '@mui/material';
import { useSelector } from 'react-redux';
import HttpClient from '../../../../API/HttpClient';
import { useNavigate } from 'react-router-dom';
import { ChatHeader } from './ChatHeader';

export interface IChatComponentProps {
    chatSelected: (chat: {chat: Chat | undefined, role: string}) => void
}

export function ChatComponent (props: IChatComponentProps) {

    const noChatTuple = {
        chat: undefined,
        role: "None"
    }
    const [chats, setChats] = React.useState<{chat: Chat, role: string}[]>([])
    const [selectedChatTuple, selectChat] = React.useState<{chat: Chat | undefined, role: string}>(noChatTuple)
    const [chatCreatorOpen, setChatCreatorOpen] = React.useState<boolean>(false)
    const navigate = useNavigate()

    const isLoggedIn: boolean = useSelector(state => state.userData.loggedIn)

    React.useEffect(() => {
        if(!isLoggedIn)
          return
        getChats()
    
      }, [isLoggedIn])  

    /**
    * Loads chats of logged user
    */
    const getChats = () => {
        const chatSubscription = HttpClient.get(`${HttpClient.baseApiUrl}/Chats`)
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


    const handleChatSelect = (e: SelectChangeEvent) => {
        if(e.target.value.chat === undefined){
          if(e.target.value.role === "Add")
            setChatCreatorOpen(true)      
          else{
            selectChat(noChatTuple)
            navigate("/main")
          }
          return
        }
        selectChat(e.target.value)
        setChatCreatorOpen(false)
      }
    
    const createChat = (name: string) => {
      setChatCreatorOpen(false)
      getChats()
      // selectChat(name)
    }

    //Getting channels on chat change
    React.useEffect(() => {
        selectedChatTuple.chat !== undefined ?
            props.chatSelected(selectedChatTuple) :
            props.chatSelected(noChatTuple)
    }, [selectedChatTuple])

  return (
    <Box>
        <ChatSelector chatTuples={chats} selectedChat={selectedChatTuple} handleChatSelect={handleChatSelect}/>
        <ChatHeader selectedChatTuple={selectedChatTuple}/>
        <CreateChatDialog open={chatCreatorOpen} handleCancel={() => {console.log("closing"); setChatCreatorOpen(false)}} handleReturn={createChat}/>
    </Box>
  );
}
