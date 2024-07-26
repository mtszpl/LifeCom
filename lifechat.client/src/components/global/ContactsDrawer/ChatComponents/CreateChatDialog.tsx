import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';
import HttpClient from '../../../../API/HttpClient';

export interface ICreateChatDialogProps {
    open: boolean
    handleReturn: (name: string) => void
    handleCancel: () => void
}

export function CreateChatDialog (props: ICreateChatDialogProps) {
    const chatsUrl: string = "https://localhost:7078/api/Chats/create"

    function submit (event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const name = formJson.chatName

        const subscription = HttpClient.post(chatsUrl, name)
            .subscribe({
                next() {},
                error(err: Error) {console.error(err.message)},
                complete() { 
                    subscription.unsubscribe()                    
                    if(props.handleReturn !== undefined) 
                        props.handleReturn(name)
                 }
            })
    }

    const handleClose = () => {
        props.handleCancel()
        props.open = false
    }

  return (
    <Dialog
        open={props.open}
        onClose={() => handleClose()}
        PaperProps={{
            component: 'form',
            onSubmit: submit
        }}
    >
        <DialogTitle>Create new chat</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Name of your new chat:
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin='dense'
                name='chatName'
                label='Name of chat'
                fullWidth
                variant='filled'
                />
        </DialogContent>
        <DialogActions>
            <Button variant='contained' onClick={() => handleClose()}>Cancel</Button>
            <Button variant='contained' type="submit">Create!</Button>
        </DialogActions>
    </Dialog>
  );
}
