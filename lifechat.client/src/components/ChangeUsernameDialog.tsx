import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';

export interface IChangeUsernameDialogProps {
    open: boolean
    onSubmit: (username: string) => void
    onCancel: () => void
}

export function ChangeUsernameDialog (props: IChangeUsernameDialogProps) {

    const [textfieldData, setTextFieldData] = React.useState<string>("")

    const submit = () => {
        props.onSubmit(textfieldData)
    }

    const handleClose = () => {
        props.onCancel()
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
                <Button variant='contained' onClick={() => handleClose()}>Cancel</Button>
                <Button variant='contained' type="submit">Confirm</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
  );
}
