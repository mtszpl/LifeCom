import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeUsernameDialog } from '../components/dialogs/ChangeUsernameDialog';
import { ChangeEmailDialog } from '../components/dialogs/ChangeEmailDialog';
import HttpClient from '../API/HttpClient';
import { ChangeProfilePicDialog } from '../components/dialogs/ChangeProfilePicDialog';
import { ProfilePicture } from '../components/ProfilePicture';
import { setProfilePicture } from '../store/slices/ProfilePictureSlice';
import { setUsername, setEmail } from '../store/slices/UserSlice';
import { first } from 'rxjs';

export interface IUserPageProps {
}

export function UserPage (props: IUserPageProps) {
    const userData = useSelector(store => store.userData)

    const [changingProfilePic, setChangingProfilePic] = React.useState<boolean>(false)
    const [changingUsername, setChangingUsername] = React.useState<boolean>(false)
    const [changingEmail, setChangingEmail] = React.useState<boolean>(false)

    const dispatch = useDispatch()

    const userUrl: string = "https://localhost:7078/api/Users"
    const imagesUrl: string = "https://localhost:7078/api/Images"

    const changeProfilePic = (newProfilePic: File | undefined) => {
        if(newProfilePic === undefined) {
            deleteProfilePic()
            return
        }
        const formData = new FormData()
        formData.append(`file`, newProfilePic)
        const subscription = HttpClient.put(imagesUrl, formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        .subscribe({         
                next: (response) => {
                    dispatch(setProfilePicture(`data:image/jpeg;base64, ${response}`))
                },
                complete: () => { subscription.unsubscribe() }
            })
        setChangingProfilePic(false)
    }

    const deleteProfilePic = () => {
        HttpClient.delete(imagesUrl).pipe(first())
            .subscribe(() => dispatch(setProfilePicture(undefined)))
        setChangingProfilePic(false)            
    }

    const changeUsername = (newUsername: string) => {
        setChangingUsername(false)
        HttpClient.put(`${userUrl}/username`, newUsername)
        dispatch(setUsername(newUsername))
    }
    
    const changeEmail = (newEmail: string) => {
        setChangingEmail(false)
        HttpClient.put(`${userUrl}/email`, newEmail)
        dispatch(setEmail(newEmail))
    }

  return (
    <Box display="flex" height="100%" width="50%" paddingTop="10vh" gap="5vh" flexDirection="column" alignItems="center">

        <Typography variant='h3'>
            User settings
        </Typography>
        
        <Typography variant='h1'>
            {userData.user ? userData.user.username : null}
        </Typography>          
        
        <ProfilePicture
            sx={{
                width: "30vh",
                aspectRatio: 1
            }}
        />
        <Button variant="contained" onClick={() => setChangingProfilePic(true)}>
            Change
        </Button>
        <Accordion sx={{ width: "100%"}}>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                Your user data
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" justifyContent="space-between">
                    <Typography>
                        Username: {userData.user ? userData.user.username : null}
                    </Typography>
                    <Button
                        onClick={() => setChangingUsername(true)}
                        variant='contained'
                    >
                        Change
                    </Button>
                </Box>
                <Box display="flex" marginTop="2vh" justifyContent="space-between">
                    <Typography>
                        E-mail: {userData.user ? userData.user.email : null}
                    </Typography>
                    <Button 
                        onClick={() => setChangingEmail(true)}
                        variant='contained'
                    >
                        Change
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
        <ChangeUsernameDialog open={changingUsername} onSubmit={changeUsername} onCancel={() => setChangingUsername(false)}/>
        <ChangeEmailDialog open={changingEmail} onSubmit={changeEmail} onCancel={() => setChangingEmail(false)}/>
        <ChangeProfilePicDialog open={changingProfilePic} onSubmit={changeProfilePic} onDelete={deleteProfilePic} onCancel={() => setChangingProfilePic(false)}/>
    </Box>
  );
}
