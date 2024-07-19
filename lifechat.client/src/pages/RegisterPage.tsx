import { useTheme } from '@emotion/react';
import { Box, Button, Link, TextField, Theme, Typography } from '@mui/material';
import * as React from 'react';
import { tokens } from '../Theme';
import { useState } from 'react';
import HttpClient from '../utility/HttpClient';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/slices/UserSlice';

export function RegisterPage () {
    const theme: Theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [email, setEmail] = useState<string>("")
    const [emailError, setEmailError] = useState<boolean>(false)

    const registerUrl: string = `https://localhost:7078/api/Auth/register`

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setEmail(e.target.value)
        if(e.target.validity.valid)
            setEmailError(false)
        else
            setEmailError(true)
    }

    const [username, setUsername] = useState<string>("")
    const [nameError, setNameError] = useState<boolean>(false)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setUsername(e.target.value)
        if(e.target.validity.valid)
          setNameError(false)
        else
          setNameError(true)
    }

    const [password, setPassword] = useState<string>("")
    const [passwordError, setPasswordError] = useState<boolean>(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | undefined>(undefined)
    
    const [repeatedPassword, setRepeatedPassword] = useState<string>("")
    const [repeatedPasswordError, setRepeatedPasswordError] = useState<boolean>(false)

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setPassword(e.target.value)
        if(!validatePassword(e.target.value))            
            setPasswordError(true)            
        else if(e.target.validity.valid)
            setPasswordError(false)        
        else {
            setPasswordError(true)
            setPasswordErrorMessage("Enter password")
        }
    }
    const handlePasswordRepeatChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRepeatedPassword(e.target.value)
    }

    React.useEffect(() => {
        if(password === repeatedPassword)
            setRepeatedPasswordError(false)
        else
            setRepeatedPasswordError(true)
    }, [password, repeatedPassword])
    
    const validatePassword = (password: string) => {
        const minLength = 8
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        if (password.length < minLength) 
            setPasswordErrorMessage('Password must be at least 8 characters long.')
        else if (!hasUpperCase) 
            setPasswordErrorMessage('Password must contain at least one uppercase letter.')
        else if (!hasLowerCase)
            setPasswordErrorMessage('Password must contain at least one lowercase letter.')
        else if (!hasNumber)
            setPasswordErrorMessage('Password must contain at least one number.')
        else if (!hasSpecialChar)
            setPasswordErrorMessage('Password must contain at least one special character.')       

        return password.length > minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    }

    const checkRegisterValidity = (e): boolean => {
        e.preventDefault()
        if(!e.target.checkValidity())
            return false     
        if(email === "" && username === ""){
            console.log("lacking one");
            setEmailError(true)
            setNameError(true)
            return false
        }       
        if(password !== repeatedPassword){
            setRepeatedPasswordError(true)
            return false
        }
        return true
    }
    
    const [formErrorMsg, setFormErrorMsg] = useState<string | undefined>(undefined)
    const reroute = useNavigate()
    const dispatch = useDispatch()

    const register = (e) => {
        e.preventDefault()
        if(!checkRegisterValidity(e))
            return
        const subscription = HttpClient.post(registerUrl, {username: username, password:password, email: email})
            .subscribe({
                next(response) {
                    console.log(response)
                    dispatch(setToken(response))
                    localStorage.setItem("token", response)
                },
                error(err: Error) {
                    console.error(err)
                    setFormErrorMsg(err.message)
                },
                complete() {
                    subscription.unsubscribe()                    
                    reroute("/")
                }
            })
    }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" bgcolor={theme.palette.background.dark}>
        <Box width="35%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="2vh" borderRadius="12px" bgcolor={theme.palette.background.light}>
            <Typography variant='h2'>Register</Typography>
            <Box component="form" width="80%" onSubmit={e => register(e)}>
                <TextField
                    margin="normal"                    
                    fullWidth
                    label="E-Mail"
                    type="email"
                    name="email"
                    autoFocus
                    onChange={e => handleEmailChange(e)}
                    error={emailError}
                    helperText={emailError ? "Enter email or username" : ""}
                />
                <TextField
                    margin="normal"                    
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
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
                    onChange={e => handlePasswordChange(e)}
                    error={passwordError}
                    helperText={passwordError ? passwordErrorMessage : ""}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="repeatPassword"
                    label="Repeat password"
                    type="password"
                    onChange={e => handlePasswordRepeatChange(e)}
                    error={repeatedPasswordError}
                    helperText={repeatedPasswordError ? "Passwords don't match" : ""}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        marginTop: "1vh"
                    }}
                    >
                    Sign In
                </Button>
            </Box>

            { formErrorMsg !== undefined && <Typography color={colors.redAccent[500]}>{formErrorMsg}</Typography>}

            <Link href="login" marginTop="1vh" alignSelf="flex-end">
              <Typography color={colors.blueAccent[200]}>Already have an account? Sing in</Typography>
            </Link>
        </Box>
    </Box>
  );
}