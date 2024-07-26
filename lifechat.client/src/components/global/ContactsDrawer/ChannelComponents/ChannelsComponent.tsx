import * as React from 'react';
import Channel from '../../../../model/Channel';
import { ChannelsSelection } from './ChannelsSelection';
import { CreateChannelDialog } from './CreateChannelDialog';
import { useNavigate } from 'react-router-dom';
import Chat from '../../../../model/Chat';
import HttpClient from '../../../../API/HttpClient';
import { Box, useTheme } from '@mui/material';

export interface IChannelsComponentProps {
  selectedChatTuple : {chat: Chat | undefined, role: string}
}

export function ChannelsComponent (props: IChannelsComponentProps) {
  const apiUrl: string = "https://localhost:7078/api/"

  const theme = useTheme()
  const navigate = useNavigate()

  const [channels, setChannels] = React.useState<Channel[]>([])
  const [channelCreatorOpen, setChannelCreatorOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    setChannels([])
    navigate("")
    if(props.selectedChatTuple.chat !== undefined)
      getChannels(props.selectedChatTuple.chat.id)
  }, [props.selectedChatTuple])

  const handleChannelSelect = (channel: Channel) => {
    navigate(`channel/${channel.id}`)    
  }

  const startCreatingChannel = () => {
    setChannelCreatorOpen(true)
  }

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

  const onCreateChannel = () => {
    setChannelCreatorOpen(false)
    if(props.selectedChatTuple.chat !== undefined)
      getChannels(props.selectedChatTuple.chat?.id)
  }

  return (
    <Box height="100%" bgcolor={theme.palette.background.default}>
      <CreateChannelDialog open={channelCreatorOpen} handleCancel={() => {setChannelCreatorOpen(false)}} chatTuple={props.selectedChatTuple} handleReturn={onCreateChannel}/>
      <ChannelsSelection channels={channels} role={props.selectedChatTuple.role} handleChannelSelect={handleChannelSelect} startCreatingChannel={startCreatingChannel}/>      
    </Box>
  );
}
