import { Box, Button, Theme, Typography } from '@mui/material';
import * as React from 'react';
import logo from "../assets/logo_404.png"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';

export interface INotFoundProps {
}

export function NotFound (props: INotFoundProps) {
    const reroute = useNavigate()
    const theme: Theme = useTheme()

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.light}>
        <img src={logo} width="20%"/>
        <Typography variant="h1">
            Sorry, we don't know where we are :(
        </Typography>
        <br/>

        <Box display="flex" width="20%" gap="4vw" marginTop="1vh">
            <Button                 
                sx={{
                    flex: 1,
                }}
                variant="contained"
                onClick={() => { reroute(-1)} }            
            >
                Go back
            </Button>
            <Button 
                sx={{
                    flex: 1,  
                }}
                variant="contained"
                onClick={() => { reroute("/")} }
            >
                Go home
            </Button>
        </Box>
    </Box>
  );
}
