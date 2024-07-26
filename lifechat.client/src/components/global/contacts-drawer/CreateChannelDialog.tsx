import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';
import HttpClient from '../../../API/HttpClient';
import Chat from '../../../model/Chat';

export interface ICreateChannelDialogProps {
    open: boolean
    chat: {chat: Chat | undefined, role: string}
    handleReturn: (name: string) => void
    handleCancel: () => void
}

export function CreateChannelDialog (props: ICreateChannelDialogProps) {
    const chatsUrl: string = "https://localhost:7078/api/Channels/create"


    function handleClose(): void {
        props.handleCancel()
    }

    function submit (event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        if(props.chat === undefined || typeof props.chat === "string"){
            close()
            return
        }
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const name = formJson.chatName
        handleClose()
        const payload = {
            chatId: props.chat.id,
            name: name
        }
        const subscription = HttpClient.post(chatsUrl, payload)
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

  return (
    <Dialog
        open={props.open}
        onClose={handleClose}
        PaperProps={{
            component: 'form',
            onSubmit: submit
        }}
    >
        <DialogTitle>Create new channel in chat {props.chat === undefined ? null : typeof props.chat !== "string" ? props.chat.name : props.chat}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Name of your new channel:
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin='dense'
                name='chatName'
                label='Name of channel'
                fullWidth
                variant='filled'
                />
        </DialogContent>
        <DialogActions>
            <Button variant='contained' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' type="submit">Create!</Button>
        </DialogActions>
    </Dialog>
  );
}
