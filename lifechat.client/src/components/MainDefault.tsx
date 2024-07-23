import { Box, Typography, useTheme } from '@mui/material';
import logo from "../assets/logo_white.png"
import * as React from 'react';


export function MainDefault () {
    const theme: Theme = useTheme()


  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.light}>
        <img src={logo} width="20%"/>
        <Typography variant="h1">
            Welcome to LifeCom
        </Typography>
        <br/>
        <Typography variant="h3">
            Pick a chat
        </Typography>        
    </Box>
  );
}
