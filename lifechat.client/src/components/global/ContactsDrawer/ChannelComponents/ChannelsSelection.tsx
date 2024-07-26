import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import Channel from '../../../../model/Channel';
import { Add } from '@mui/icons-material';
import { ChannelListElement } from './ChannelListElement';

export interface IChannelsSelectionProps {
    channels: Channel[]
    role: string
    handleChannelSelect: (c: Channel) => void
    startCreatingChannel: () => void
}

export function ChannelsSelection (props: IChannelsSelectionProps) {
    const theme = useTheme()

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" paddingY="1vh" paddingX="0.5vw" gap="2vh">
      {props.channels.map((channel: Channel, idx: number) => (
        <ChannelListElement key={idx} channel={channel} role={props.role} handleChannelSelect={props.handleChannelSelect}/>
      ))}
      { props.role === "Admin" ? 
        <Box width="100%" minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" marginTop="3vh" display="flex"
        onClick={() => props.startCreatingChannel()}
        sx={{
          borderBottom: "solid",
          transition: "background-color 0.2s ease-out",
          ':hover': {
            bgcolor: theme.palette.background.dark,
          },
          ':active': {
            bgcolor: theme.palette.background.light,                  
          }
        }}
        >              
          <Add/>   
        </Box>
        : null
      }
    </Box>  
)
}
