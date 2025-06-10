import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import Chat from '../../../../model/Chat';
import { Settings } from '@mui/icons-material';
import { ChatManagerDialog, EChatMode } from '../../../dialogs/ChatManagerDialog';

export interface IChatHeaderProps {
    selectedChatTuple: {chat: Chat | undefined, role: string} | undefined
}

export function ChatHeader (props: IChatHeaderProps) {
    const theme = useTheme()
    
    const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null)
    const [isManagerOpen, setManagerOpen] = React.useState<boolean>(false)
    const [isMenuOpen, setMenuOpen] = React.useState<boolean>(false)
    const [chatManagerMode, setChatManagerMode] = React.useState<EChatMode | undefined>(undefined)

    React.useEffect(() => {
        console.clear()
        console.log(props.selectedChatTuple)
    }, [props.selectedChatTuple])
    
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

    }

    const handleRemoveUser = () => {

    }

    const handleChangeRole = () => {

    }

    const handleRenameChat = () => {

    }

    const enableManager = (mode: EMode) => {
        setMenuOpen(false)
        setChatManagerMode(mode)
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
        <Menu open={isMenuOpen} anchorEl={anchorEl} onClose={handleClose}>
            <MenuItem onClick={() => enableManager(EChatMode.addUser)}>Add User</MenuItem>
            <MenuItem onClick={() => enableManager(EChatMode.removeUser)}>Remove User</MenuItem>
            <MenuItem onClick={() => enableManager(EChatMode.changeUserRole)}>Edit User Role</MenuItem>
            <MenuItem onClick={() => enableManager(EChatMode.rename)}>Rename Chat</MenuItem>
        </Menu>
        <ChatManagerDialog isOpen={isManagerOpen} 
            mode={chatManagerMode}
            chat={props.selectedChatTuple.chat} 
            onClose={() => setManagerOpen(false)} />
    </Box>
  );
}
