import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';

export interface IChangeUsernameDialogProps {
    open: boolean
    onSubmit: (username: string) => void
    onCancel: () => void
}

export function ChangeUsernameDialog (props: IChangeUsernameDialogProps) {

    const [textfieldData, setTextFieldData] = React.useState<string>("")

    const submit = (e) => {
        e.preventDefault()
        props.onSubmit(textfieldData)
    }
    
    const handleClose = (e) => {
        e.preventDefault()
        props.onCancel()
    }

  return (
    <Dialog
        open={props.open}
        onClose={(e) => handleClose(e)}
        PaperProps={{
            component: 'form',
            onSubmit: submit
        }}
    >
        <DialogTitle>
            Change your username
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                New username:
            </DialogContentText>
            <TextField 
                autoFocus
                required
                margin='dense'
                label="New username"
                fullWidth
                variant='filled'
                onChange={e => setTextFieldData(e.target.value)}

                />
            <DialogActions>
                <Button variant='contained' onClick={(e) => handleClose(e)}>Cancel</Button>
                <Button variant='contained' type="submit">Confirm</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
  );
}
