import { useTheme } from '@emotion/react';
import { Box, Button, Checkbox, FormControlLabel, Link, TextField, Theme, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { tokens } from '../Theme';
import HttpClient from '../API/HttpClient';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setToken, setUsername } from '../store/slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import Interceptors from '../API/Interceptors';
import LoginUtils from '../utility/LoginUtils';

export function LoginPage () {
    const theme: Theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [loginString, setLoginString] = useState<string>("")
    const [nameError, setNameError] = useState<boolean>(false)
    
    const [password, setPassword] = useState<string>("")
    const [passwordError, setPasswordError] = useState<boolean>(false)

    const [formErrorMsg, setFormErrorMsg] = useState<string | undefined>(undefined)
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    React.useEffect(() => {
      localStorage.removeItem("remember")
      localStorage.removeItem("token")
      Interceptors.clearInterceptors()
    }, [])

    const toggleRememberMe = () => {
      setRememberMe(!rememberMe)
    }

    const loginUrl: string = `https://localhost:7078/api/Auth/login`
    const reroute = useNavigate()
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
      setLoginString(e.target.value)
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

    const isEmail = (username: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(username);
  };

    const handleSubmit = (e) => {
      e.preventDefault()
      if(!e.target.checkValidity())
        return
      if(rememberMe)
        localStorage.setItem("remember", "true")
      const payload = !isEmail(loginString) ?
      {username: loginString, password: password, email: null}
      : {username: null, password: password, email: loginString}
      const subsciption = HttpClient.post(loginUrl, payload)
        .subscribe({
          next(response) {
            LoginUtils.loginDetails(response)
          },
          error(err: Error) {
            console.error(err); // Handle errors here
            setFormErrorMsg(err.message)
          },
          complete() {
            setFormErrorMsg(undefined)
            subsciption.unsubscribe()
            Interceptors.addAuthInterceptor()
            reroute("/main")
          }
        });
    }

  return (
    <Box width="100%" height="100%" display="flex" bgcolor={theme.palette.background.default} justifyContent="center" alignItems="center">
      <Box width="35%" borderRadius="12px"
        bgcolor={theme.palette.background.light} display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY="2vh">
        <Typography variant="h2">Sign in</Typography>
        <Box component="form" onSubmit={e => handleSubmit(e)} width="80%">
          <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username or email"
              name="username"
              autoFocus
              onChange={e => handleNameChange(e)}
              error={nameError}
              helperText={nameError ? "Enter username or email" : ""}
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
            control={<Checkbox value="remember" onChange={() => toggleRememberMe()} color="primary"/>}
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

          { formErrorMsg !== undefined && <Typography color={colors.redAccent[500]}>{formErrorMsg}</Typography>}

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
