import { Box, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import Channel from '../../../../model/Channel';
import { Remove, Settings } from '@mui/icons-material';
import { useTheme } from '@emotion/react';

export interface IChannelListElementProps {
    key: number
    channel: Channel
    role: string
    handleChannelSelect: (c: Channel) => void
}

export function ChannelListElement (props: IChannelListElementProps) {
    const theme = useTheme()

    const handleMinusClick = (e: MouseEvent) => {
      e.stopPropagation()
    }

  return (
    <Box minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" display="flex"
          sx={{
            borderBottom: "solid",
            justifyContent: "space-between",
            transition: "background-color 0.2s ease-out",
            ':hover': {
              bgcolor: theme.palette.background.dark,
            },
            ':active': {
              bgcolor: theme.palette.background.light,                  
            }
          }}
          onClick={() => {
            props.handleChannelSelect(props.channel)                  
          }}
          >           
            <Typography
              variant="h5">
                {props.channel.name}
            </Typography>
            { props.role === "Admin" ?
              <IconButton
                sx={{ 
                  marginRight: "1vw",
                  ':hover': {
                    fontColor: theme.palette.background.dark,
                  }
                }}
                onClick={(e) => handleMinusClick(e)}
              >
                <Settings/> 
              </IconButton>
              :
              null
            }
    </Box>
  );
}
