import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';
import Chat from '../../../../model/Chat';


export interface ICreateChannelDialogProps {
    open: boolean
    chatTuple: {chat: Chat | undefined, role: string}
    handleReturn: (name: string) => void
    handleCancel: () => void
}

export function CreateChannelDialog (props: ICreateChannelDialogProps) {

    function handleClose(): void {
        props.handleCancel()
    }

    function submit (event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        if(props.chatTuple === undefined || typeof props.chatTuple === "string"){
            close()
            return
        }
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const name = formJson.chatName
        if(name === undefined || props.chatTuple.chat === undefined)
            handleClose()        
        else
            props.handleReturn(name)

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
        <DialogTitle>Create new channel in chat {props.chatTuple === undefined ? null : typeof props.chatTuple !== "string" ? props.chatTuple.name : props.chatTuple}</DialogTitle>
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
