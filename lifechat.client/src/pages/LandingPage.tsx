import { Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens, useMode } from '../Theme';
import logo from '../assets/logo.png';

export function LandingPage () {

    const [theme, colorMode] = useMode()
    const colors = tokens(theme.palette.mode)

    const reroute = useNavigate()

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.light}>
        <img src={logo} width="20%"/>
        <Typography variant="h1">
            Welcome to LifeCom
        </Typography>
        <br/>
        <Typography variant="h3">
            Used by no one, but still cool
        </Typography>
        <Box display="flex" width="20%" gap="4vw" marginTop="1vh">
            <Button                 
                sx={{
                    flex: 1,
                }}
                variant="contained"
                onClick={() => { reroute("/register")} }            
            >
                Join
            </Button>
            <Button 
                sx={{
                    flex: 1,  
                }}
                variant="contained"
                onClick={() => { reroute("/login")} }
            >
                Log in
            </Button>
        </Box>
    </Box>
  );
}
