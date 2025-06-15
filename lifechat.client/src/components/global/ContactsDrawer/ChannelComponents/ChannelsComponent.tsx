import * as React from 'react';
import Channel from '../../../../model/Channel';
import { ChannelsList } from './ChannelsList';
import { useNavigate } from 'react-router-dom';
import Chat from '../../../../model/Chat';
import HttpClient from '../../../../API/HttpClient';
import { Box, useTheme } from '@mui/material';
import { CreateChannelDialog } from '../../../dialogs/CreateChannelDialog';
import { SignalConnector } from '../../../../API/SignalConnector';

export interface IChannelsComponentProps {
  selectedChatTuple : {chat: Chat | undefined, role: string}
}

export function ChannelsComponent (props: IChannelsComponentProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const [channels, setChannels] = React.useState<Channel[]>([])
  const [channelCreatorOpen, setChannelCreatorOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    SignalConnector.onChangedChannelMembership(onAddedToChannel)
  }, [])

  React.useEffect(() => {
    setChannels([])
    if(props.selectedChatTuple.chat !== undefined) {
      getChannels(props.selectedChatTuple.chat.id)
    }
    console.log(`changed ${props.selectedChatTuple}`);
  }, [props.selectedChatTuple])

  const handleChannelSelect = (channel: Channel) => {
    navigate(`channel/${channel.id}`)    
  }
  
  const startCreatingChannel = () => {
    setChannelCreatorOpen(true)
  }

  const onAddedToChannel = (chatId: number) => {
    getChannels(chatId)
  }

  /**
  * Loads channels of chat from server
  * @param chatId Id of selected chat
  */
  const getChannels = (chatId: number) => {
    setChannels([])
    const channelsSubscription = HttpClient.get(`${HttpClient.baseApiUrl}/Channels/bychat?chatId=${chatId}`)
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

  const createChannel = (name: string) => {
    if(props.selectedChatTuple.chat === undefined)
      return
    const chatId = props.selectedChatTuple.chat.id
    const payload = {
      chatId: chatId,
      name: name
    }
    const subscription = HttpClient.post(`${HttpClient.baseApiUrl}/Channels/create?atChat=${chatId}`, payload)
    .subscribe({
        next() {},
        error(err: Error) {console.error(err.message)},
        complete() { 
            subscription.unsubscribe()
            if(props.selectedChatTuple.chat !== undefined)
              getChannels(props.selectedChatTuple.chat?.id)
         }
    })
    setChannelCreatorOpen(false)
  }

  return (
    <Box height="100%" bgcolor={theme.palette.background.default}>
      <CreateChannelDialog open={channelCreatorOpen} handleCancel={() => {setChannelCreatorOpen(false)}} chatTuple={props.selectedChatTuple} handleReturn={createChannel}/>
      <ChannelsList channels={channels} role={props.selectedChatTuple.role} handleChannelSelect={handleChannelSelect} startCreatingChannel={startCreatingChannel}/>      
    </Box>
  );
}
