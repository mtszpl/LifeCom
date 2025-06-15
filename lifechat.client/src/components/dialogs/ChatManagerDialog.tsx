import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
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

    const content = () => {
        switch(props.mode){
            case(EChatMode.addUser):
            case(EChatMode.removeUser):
                return (
                    <Typography variant='h4'>
                        Select user to {props.mode === EChatMode.addUser ?
                         "add" : "remove"}
                    </Typography>
                )
            case(EChatMode.rename):
                return (
                    <TextField
                        label="New name for chat:"
                        variant="filled"
                    />
                )
            case(EChatMode.changeUserRole):
                return (
                    <Typography>
                        PLACEHOLDER
                    </Typography>
                )
            default:
                return (
                    <Typography>
                        Error occured, please try again
                    </Typography>
                )
        }
    }

  return (
    <Dialog open={props.isOpen}
        onClose={props.onClose}
    >
        <DialogTitle variant="h3"
        >
            {titleDescription()}: <br/>
            {props.chat?.name || ""}
        </DialogTitle>
        <DialogContent>
            {content()}
            <Box margin="1rem" display="flex" justifyContent="space-around">
                <Button variant="contained">
                    Confirm
                </Button>
                <Button variant="contained" color='error'>
                    Cancel
                </Button>
            </Box>
        </DialogContent>
    </Dialog>
  );
}
