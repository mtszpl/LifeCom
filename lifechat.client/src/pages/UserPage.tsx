import { useTheme } from '@emotion/react';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../assets/defaultAvatar.png';
import { ChangeUsernameDialog } from '../components/ChangeUsernameDialog';

export interface IUserPageProps {
}

export function UserPage (props: IUserPageProps) {
    const userData = useSelector(store => store.userData)

    const [changingUsername, setChangingUsername] = React.useState<boolean>(false)
    const [changingEmail, setChangingEmail] = React.useState<boolean>(false)
    
    const changeUsername = (newUsername: string) => {

    }

  return (
    <Box display="flex" height="100%" width="50%" paddingTop="10vh" gap="5vh" flexDirection="column" alignItems="center">
        <Typography variant='h3'>
            User settings
        </Typography>
        <Typography variant='h1'>
            {userData.user.username}
        </Typography>
        <Box
            sx={{
                width: "20vh",
                aspectRatio: 1
            }}
          component="img"
          src={
            userData.user.profilePic !== "" ?
                userData.user.profilePic :
                defaultAvatar
          }
        />
        <Button variant="contained">
            Change
        </Button>
        <Accordion sx={{ width: "100%"}}>
            <AccordionSummary expandIcon={<ExpandMore/>}>
                Your user data
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex"justifyContent="space-between">
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
                    <Button variant='contained'>
                        Change
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
        <ChangeUsernameDialog open={changingUsername} onSubmit={changeUsername} onCancel={() => setChangingUsername(false)}/>
    </Box>
  );
}
