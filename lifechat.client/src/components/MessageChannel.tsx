import { Box, TextField, Button, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import Message from '../model/Message';
import HttpClient from '../API/HttpClient';
import { MessageBox } from './MessageBox';
import { useSelector } from 'react-redux';
import { SignalConnector } from '../API/SignalConnector';
import { useParams } from 'react-router-dom';
import { SendSharp } from '@mui/icons-material';

export function MessageChannel () {
    const { id } = useParams()

    const theme: Theme = useTheme()
    const [messages, setMessages] = useState<Message[]>([])
    const connector: SignalConnector = useSelector(state => state.connectorContainer.connector)

    const [content, setContent] = useState<string>("")

    const messageUrl: string = "https://localhost:7078/api/Messages"

    useEffect(() => {
        getMessages()
    }, [id])

    useEffect(() => {
        if(connector !== undefined)
            connector.onReceiveMessage(getMessages)
        
    }, [connector])    

    const getMessages = () => {
        HttpClient.get(`${messageUrl}?id=${id}`)
        .subscribe((data) => {
            setMessages(data)
        })
    }

    const handleMessageTyping = (e) => {
        setContent(e.target.value)
    }

    const send = (e) => {
        e.preventDefault()
        if(content === "")
            return
        const message = {
            content: content,
            channelId: id
        }
        setContent("")
        HttpClient.post(messageUrl, message)
    }


  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">   
        <Box display="flex" flexDirection="column" height="100%" gap="2vh" marginY="2vh" overflow="auto" bgcolor={theme.palette.background.light}>
            {
                messages.map((msg, idx) => (
                    <MessageBox message={msg} key={idx}/>
                ))
            }            
        </Box>
        <Box component="form" onSubmit={(e) => send(e)} marginTop="auto" display="flex" marginX="1vw" marginBottom="1vh" bgcolor={theme.palette.background.light} paddingTop="1vh">
            <TextField sx={{ width: "100%" }} value={content} onChange={e => handleMessageTyping(e)}/>
            <Button type='submit' variant="contained" sx={{ bgcolor: theme.palette.primary.light, marginLeft: "0.3vw" }}>
                <SendSharp fontSize="large"/>
            </Button>
        </Box>
    </Box>
  );
}
