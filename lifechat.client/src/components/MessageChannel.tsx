import { SendSharp } from '@mui/icons-material';
import { Box, TextField, Button, useTheme } from '@mui/material';
import Channel from '../model/Channel';
import { useEffect, useState } from 'react';
import Message from '../model/Message';
import HttpClient from '../API/HttpClient';
import { MessageBox } from './MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { sendToConnection } from '../store/slices/ConnectorSlice';

export interface IMessageChannelProps {
    contentOffset: number,
    drawerTransitionTime: number
    channel: Channel
}

export function MessageChannel (props: IMessageChannelProps) {
    const theme: Theme = useTheme()
    const [messages, setMessages] = useState<Message[]>([])
    const connector = useSelector(store => store.connector)
    const dispatch = useDispatch()

    const [content, setContent] = useState<string>("")

    const messageUrl: string = "https://localhost:7078/api/Messages"

    useEffect(() => {
        console.log(props.channel.id);
        HttpClient.get(`${messageUrl}?id=${props.channel.id}`)
            .subscribe((data) => {
                setMessages(data)
            })
    }, [])

    const handleMessageTyping = (e) => {
        setContent(e.target.value)
    }

    const send = (e) => {
        e.preventDefault()
        if(content === "")
            return
        const message: Message = new Message()
        message.content = content
        message.channelId = props.channel.id
        console.log(message);
        HttpClient.post(messageUrl, message)
        // dispatch(sendToConnection(content))
    }
    

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">   
        <Box display="flex" flexDirection="column" height="100%" gap="1vh" marginY="2vh" bgcolor={theme.palette.background.light}>
            {
                messages.map(msg => (
                    <MessageBox message={msg}/>
                ))
            }
        </Box>
        <Box component="form" onSubmit={(e) => send(e)} marginTop="auto" display="flex" marginX="1vw" marginBottom="1vh" bgcolor={theme.palette.background.light} paddingTop="1vh">
            <TextField sx={{ width: "100%",  }} onChange={e => handleMessageTyping(e)}/>
            <Button type='submit' variant="contained" sx={{ bgcolor: theme.palette.primary.light, marginLeft: "0.3vw" }}>
                <SendSharp fontSize="large"/>
            </Button>
        </Box>
    </Box>
  );
}
