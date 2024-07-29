import * as React from 'react';
import { ChatSelector } from './ChatSelector';
import { CreateChatDialog } from './CreateChatDialog';
import Chat from '../../../../model/Chat';
import { SelectChangeEvent } from '@mui/material';
import { useSelector } from 'react-redux';
import HttpClient from '../../../../API/HttpClient';
import { useNavigate } from 'react-router-dom';

export interface IChatComponentProps {
    chatSelected: (chat: {chat: Chat | undefined, role: string}) => void
}

export function ChatComponent (props: IChatComponentProps) {

    const noChatTuple = {
        chat: undefined,
        role: "None"
    }
    const apiUrl: string = "https://localhost:7078/api/"

    const [chats, setChats] = React.useState<{chat: Chat, role: string}[]>([])
    const [selectedChatTuple, selectChat] = React.useState<{chat: Chat | undefined, role: string}>(noChatTuple)
    const [chatCreatorOpen, setChatCreatorOpen] = React.useState<boolean>(false)

    const isLoggedIn: boolean = useSelector(state => state.userData.loggedIn)

    const navigate = useNavigate()

    React.useEffect(() => {
        if(!isLoggedIn)
          return
        getChats()
    
      }, [isLoggedIn])  

    /**
    * Loads chats of logged user
    */
    const getChats = () => {
        console.log("getting chats");
        const chatSubscription = HttpClient.get(`${apiUrl}Chats`)
        .subscribe(({
            next(response) {
              console.log("chats");
              console.log(response)
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
          selectChat(e.target.value)
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
    <div>
        <ChatSelector chatTuples={chats} selectedChat={selectedChatTuple} handleChatSelect={handleChatSelect}/>
        <CreateChatDialog open={chatCreatorOpen} handleCancel={() => {console.log("closing"); setChatCreatorOpen(false)}} handleReturn={createChat}/>
    </div>
  );
}
