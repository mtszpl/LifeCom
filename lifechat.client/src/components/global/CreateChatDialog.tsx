import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';
import HttpClient from '../../API/HttpClient';

export interface ICreateChatDialogProps {
    open: boolean
    return: (name: string) => void
}

export function CreateChatDialog (props: ICreateChatDialogProps) {
    const [open, setOpen] = React.useState<boolean>(props.open)
    const chatsUrl: string = "https://localhost:7078/api/Chats/create"

    React.useEffect(() => {
        setOpen(props.open)
    }, [props.open])

    function handleClose(): void {
        setOpen(false)
    }

    function submit (event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const name = formJson.chatName
        handleClose()

        const subscription = HttpClient.post(chatsUrl, name)
            .subscribe({
                next() {},
                error(err: Error) {console.error(err.message)},
                complete() { 
                    subscription.unsubscribe()
                    
                    if(props.return !== undefined) 
                        props.return(name)
                 }
            })
    }

  return (
    <Dialog
        open={open}
        onClose={handleClose}
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
            <Button variant='contained' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' type="submit">Create!</Button>
        </DialogActions>
    </Dialog>
  );
}
