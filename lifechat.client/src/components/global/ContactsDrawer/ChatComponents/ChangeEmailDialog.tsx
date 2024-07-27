import * as React from 'react';

export interface IChangeEmailDialogProps {
    open: boolean
    onSubmit: (username: string) => void
    onCancel: () => void
}

export function ChangeEmailDialog (props: IChangeEmailDialogProps) {
    
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
