import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import * as React from 'react';
import Chat from '../../model/Chat';

export interface IChatManagerDialogProps {
    isOpen: boolean,
    mode?: EChatMode
    chat: Chat,
    onClose: () => void
}

export enum EChatMode {
    addUser,
    removeUser,
    rename,
    changeUserRole
}


export function ChatManagerDialog (props: IChatManagerDialogProps) {
    const titleDescription = () => {
        switch (props.mode) {
            case(EChatMode.addUser):
                return "Add user to chat "
            case(EChatMode.removeUser):
                return "Remove user from chat "
            case(EChatMode.rename):
                return "Rename chat "
            case(EChatMode.changeUserRole):
                return "Change role in chat "
            default:
                return "Error"
        }
    }

  return (
    <Dialog open={props.isOpen}
        onClose={props.onClose}
    >
        <DialogTitle variant="h3"
        >
            {titleDescription()}
            {props.chat.name}
        </DialogTitle>
        <DialogContent>
            
        </DialogContent>
    </Dialog>
  );
}
