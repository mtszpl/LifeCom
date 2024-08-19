import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as React from 'react';

export interface IChangeProfilePicDialogProps {
    open: boolean
    onSubmit: (f: File | undefined) => void
    onDelete: () => void
    onCancel: () => void
}

export function ChangeProfilePicDialog (props: IChangeProfilePicDialogProps) {

    const [image, setImage] = React.useState<File | undefined>(undefined)

    const submit = (e) => {
        e.preventDefault()
        console.log(typeof image);
        props.onSubmit(image)
    }
    
    const handleClose = (e) => {
        e.preventDefault()
        props.onCancel()
    }

    const updateImage = (e) => {
        const file: File = e.target.files[0]
        if(file === undefined)
            return
        console.log(typeof file);
        // setImage(URL.createObjectURL(file))
        setImage(file)
        console.log(file);
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
                Change your profile image
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap="1vh">
                    <input type="file" name="Profile Image" onChange={e => updateImage(e)}/>
                    {
                        image !== undefined ?
                        <img alt="profile picture" src={URL.createObjectURL(image)}/> : null
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Box width="100%" display="flex" justifyContent="space-around">
                    <Button variant='contained' onClick={(e) => handleClose(e)}>Cancel</Button>
                    <Button variant='contained' onClick={() => props.onDelete()}>Delete</Button>
                    <Button variant='contained' type="submit">Confirm</Button>
                </Box>
            </DialogActions>
    </Dialog>
  );
}
