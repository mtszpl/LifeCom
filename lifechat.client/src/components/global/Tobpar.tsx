import { useTheme } from '@emotion/react';
import { ColorModecontext, tokens } from '../../Theme';
import { AppBar, Box, Button, IconButton, Typography } from '@mui/material';
import { AccountCircle, BrightnessHigh, BrightnessLowOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_white.png'
import { useSelector } from 'react-redux';
import Interceptors from '../../API/Interceptors';

export interface ITopbarProps {
  drawerWidth: number
  drawerTransitionTime: number
  height?: number
  onMenuOpen?: () => void
}

export function Topbar (props: ITopbarProps) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const colorMode = useContext(ColorModecontext)

    const user = useSelector(state => state.user)

    const navigate = useNavigate()

    const height = props.height ?? 5;

    useEffect(() => {console.log(user)}, [user])

  return (
    <Box sx={{width:"100%", height: `${height}vh`}}>

      <AppBar position="absolute" 
        sx={{height: '5vh', width: `calc(100vw - ${props.drawerWidth}vw)`, bgcolor: theme.palette.background.light,
        transition: `width ${props.drawerTransitionTime}ms ease-out`
        
      }}>
        <Box sx={{height: `${height}vh`}} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton sx={{ color: colors.white[200], marginX: "0.5vw"}}  onClick={() => {if (props.onMenuOpen !== undefined) props.onMenuOpen()}}>
              <MenuIcon fontSize='large'/>
            </IconButton>
            <img src={logo}  width="5%" color={colors.white[100]}/>
            <Typography variant='h3' color={colors.white[200]} ml="2vh">
              LifeCom
            </Typography>
          </Box>
          <span/>
          <Box display="flex" alignItems="center">
            <Button 
              variant="contained"
              onClick={() => {
                Interceptors.removeAuthInterceptor()
                navigate("/")}}
              >
              Log out
            </Button>
            <IconButton onClick={() => {
              user.loggedIn ?
              navigate('/username') :
              navigate(`/login`)
            }}>
              <AccountCircle/>
            </IconButton>
            <Typography variant="h3">
              { user !== undefined ? user.name : ""}
            </Typography>
            <IconButton
              onClick={() => colorMode.toggleColorMode()}>
              {
                theme.palette.mode === "dark" ? (
                  <BrightnessLowOutlined/>
                ) : (
                  <BrightnessHigh/>
                )
              }
            </IconButton>
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
}
