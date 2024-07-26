import { useTheme } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import Channel from '../../../model/Channel';
import { Add, Remove } from '@mui/icons-material';

export interface IChannelsSelectionProps {
    channels: Channel[]
    role: string
    handleChannelSelect: (c: Channel) => void
}

export function ChannelsSelection (props: IChannelsSelectionProps) {
    const theme = useTheme()

  return (
    <Box width="95%">
      {props.channels.map((channel: Channel, idx: number) => (
        <Box key={idx} minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" display="flex"
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
          onClick={() => {
            props.handleChannelSelect(channel)                  
          }}
          >              
            <Typography
              variant="h5">
                {channel.name}
            </Typography>
            { props.role === "Admin" ?
              <Remove/> :
              null
            }
        </Box>
      ))}
      { props.role === "Admin" ? 
        <Box width="100%" minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" marginTop="3vh" display="flex"
        // onClick={() => setChannelCreatorOpen(true)}
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
