import { useTheme } from '@emotion/react';
import { Box, Button, Checkbox, FormControlLabel, Link, TextField, Theme, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { tokens } from '../Theme';

export function LoginPage () {
    const theme: Theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [username, setUsername] = useState<string>("")
    const [nameError, setNameError] = useState<boolean>(false)
    
    const [password, setPassword] = useState<string>("")
    const [passwordError, setPasswordError] = useState<boolean>(false)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
      setUsername(e.target.value)
      if(e.target.validity.valid)
        setNameError(false)
      else
        setNameError(true)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
      setPassword(e.target.value)
      if(e.target.validity.valid)
        setPasswordError(false)
      else
        setPasswordError(true)
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      if(e.target.checkValidity())
      console.log("logging in");
    }

  return (
    <Box width="100%" height="100%" display="flex" bgcolor={theme.palette.background.default} justifyContent="center" alignItems="center">
      <Box width="35%" borderRadius="12px" bgcolor={theme.palette.background.light} display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY="2vh">
        <Typography variant="h3">Sign in</Typography>
        <Box component="form" onSubmit={e => handleSubmit(e)} width="80%">
          <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              onChange={e => handleNameChange(e)}
              error={nameError}
              helperText={nameError ? "Enter username" : ""}
            />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={e => handlePasswordChange(e)}
            error={passwordError}
            helperText={passwordError ? "Enter password" : ""}
          />
          <FormControlLabel 
            control={<Checkbox value="remember" color="primary"/>}
            label="Remember me"
            sx={{ alignSelf: 'flex-start', width: "100%" }}
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign In
            </Button>

            <Box display="flex" justifyContent="space-between" marginTop="1vh">
              <Link>
                <Typography color={colors.blueAccent[200]}>Forgot password?</Typography>
              </Link>
              <Link href="register" variant="body2">
                <Typography color={colors.blueAccent[200]}>Don't have an account? Sign up!</Typography>
              </Link>
            </Box>
        </Box>
      </Box>
    </Box>
  );
}
