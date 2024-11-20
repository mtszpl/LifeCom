import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import Channel from '../../../../model/Channel';
import { useTheme } from '@emotion/react';
import React from 'react';
import { Settings } from '@mui/icons-material';
import { ChannelManagerDialog, EMode } from '../../../dialogs/ChannelManagerDialog';

export interface IChannelListElementProps {
    key: number
    channel: Channel
    role: string
    handleChannelSelect: (c: Channel) => void
}

export function ChannelListElement (props: IChannelListElementProps) {
    const theme = useTheme()

    const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false)
    const [isManagerOpen, setManagerOpen] = React.useState<boolean>(false)
    const [editChannelMode, setEditChannelMode] = React.useState<EMode | undefined>(undefined)
    const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null)

    const handleMenuOpen = (e: MouseEvent) => {
      e.stopPropagation()
      setAnchorEl(e.currentTarget)
      setMenuOpen(true)
    }
    
    const handleClose = () => {
      setMenuOpen(false)
      setAnchorEl(null)
    }

    const handleAddUser = () => {
      enableManager(EMode.add)
    }
    const handleRemoveUser = () => {
      enableManager(EMode.remove)
      
    }
    const handleChangeUserRole = () => {
      enableManager(EMode.changeRole)

    }

    const enableManager = (mode: EMode)  => {
      setMenuOpen(false)
      setManagerOpen(true)
      setEditChannelMode(mode)
    }

  return (
    <Box minHeight="3vh" paddingLeft="1vw" paddingTop="1vh" display="flex"
          sx={{
            borderBottom: "solid",
            justifyContent: "space-between",
            cursor: "pointer",
            alignItems: "center",
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
                onClick={(e) => handleMenuOpen(e)}
              >
                <Settings/>
              </IconButton>
              :
              null
            }
            <Menu open={isMenuOpen} anchorEl={anchorEl} onClose={handleClose}>
              <MenuItem onClick={handleAddUser}>Add User</MenuItem>
              <MenuItem onClick={handleRemoveUser}>Remove User</MenuItem>
              <MenuItem onClick={handleChangeUserRole}>Set Roles</MenuItem>
            </Menu> 
            <ChannelManagerDialog isOpen={isManagerOpen} mode={editChannelMode} channel={props.channel} onClose={() => setManagerOpen(false)}/>
    </Box>
  );
}
