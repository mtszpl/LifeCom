import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../assets/defaultAvatar.png';
import { ChangeUsernameDialog } from '../components/dialogs/ChangeUsernameDialog';
import { ChangeEmailDialog } from '../components/dialogs/ChangeEmailDialog';
import HttpClient from '../API/HttpClient';
import { ChangeProfilePicDialog } from '../components/dialogs/ChangeProfilePicDialog';

export interface IUserPageProps {
}

export function UserPage (props: IUserPageProps) {
    const userData = useSelector(store => store.userData)

    React.useEffect(() => {
        console.log(userData);
        console.log(userData.user);
    }, [userData])

    const [changingProfilePic, setChangingProfilePic] = React.useState<boolean>(false)
    const [changingUsername, setChangingUsername] = React.useState<boolean>(false)
    const [changingEmail, setChangingEmail] = React.useState<boolean>(false)

    const url: string = "https://localhost:7078/api/Users"
    
    const changeProfilePic = (newProfilePic: File | undefined) => {
        console.log(newProfilePic);
        if(newProfilePic === undefined)
            return
        setChangingUsername(false)
        HttpClient.put(`${url}/image`, newProfilePic)
    }

    const deleteProfilePic = () => {

    }

    const changeUsername = (newUsername: string) => {
        setChangingUsername(false)
        console.log(`changing username: ${newUsername}`);
        HttpClient.put(`${url}/username`, newUsername)
    }
    
    const changeEmail = (newEmail: string) => {
        setChangingEmail(false)
        console.log(`changing email to: ${newEmail}`);
    }

  return (
    <Box display="flex" height="100%" width="50%" paddingTop="10vh" gap="5vh" flexDirection="column" alignItems="center">
        <Typography variant='h3'>
            User settings
        </Typography>
        <Typography variant='h1'>
            {userData !== undefined ? userData.user.username : null}
        </Typography>
        <Box
            sx={{
                width: "20vh",
                aspectRatio: 1
            }}
          component="img"
          src={
            (userData !== undefined &&
            userData.user.profilePic !== "") ?
                userData.user.profilePic :
                defaultAvatar
          }
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
                        Username: {userData.user.username}
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
                        E-mail: {userData.user.email}
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
