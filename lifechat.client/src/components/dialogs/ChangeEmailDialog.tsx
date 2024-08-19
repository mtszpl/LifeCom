import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import * as React from 'react';

export interface IChangeEmailDialogProps {
    open: boolean
    onSubmit: (username: string) => void
    onCancel: () => void
}

export function ChangeEmailDialog (props: IChangeEmailDialogProps) {
    
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
            Change your email
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                New email:
            </DialogContentText>
            <TextField 
                autoFocus
                required
                margin='dense'
                label="New email"
                fullWidth
                variant='filled'
                type="email"
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
