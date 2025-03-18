import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import Chat from '../../../../model/Chat';
import { Settings } from '@mui/icons-material';
import { ChatManagerDialog } from '../../../dialogs/ChatManagerDialog';

export interface IChatHeaderProps {
    selectedChatTuple: {chat: Chat | undefined, role: string} | undefined
}

export function ChatHeader (props: IChatHeaderProps) {
    const theme = useTheme()
    
    const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null)
    const [isManagerOpen, setManagerOpen] = React.useState<boolean>(false)
    const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false)
    
    const handleMenuOpen = (e: MouseEvent) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
        setMenuOpen(true)
    }

    const handleClose = () => {
        setMenuOpen(false)
        setAnchorEl(null)
    }

    const enableManager = (mode: EMode) => {
        setMenuOpen(false)
        setManagerOpen(true)
    }


  return (
    <Box margin="1rem" display="flex" justifyContent="space-around" alignItems="center">
        <Typography variant='h2'>
            {props.selectedChatTuple?.chat?.name}
        </Typography>
        { props.selectedChatTuple?.role === "Admin" ?
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
        <Menu open={isManagerOpen} anchorEl={anchorEl} onClose={handleClose}>
            <MenuItem onClick={handleAddUser}>Add User</MenuItem>
            <MenuItem onClick={handleRemoveUser}>Remove User</MenuItem>
            <MenuItem onClick={handleChangeRole}>Edit User Role</MenuItem>
            <MenuItem onClick={handleRenameChat}>Rename Chat</MenuItem>
        </Menu>
        <ChatManagerDialog isOpen={isMenuOpen} 
            chat={props.selectedChatTuple.chat} 
            onClose={() => setManagerOpen(false)} />
    </Box>
  );
}
