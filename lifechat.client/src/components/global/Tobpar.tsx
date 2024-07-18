import { useTheme } from '@emotion/react';
import { ColorModecontext, tokens } from '../../Theme';
import { AppBar, Box, IconButton, Typography } from '@mui/material';
import { AccountCircle, BrightnessHigh, BrightnessLowOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';

export interface ITopbarProps {
  drawerWidth: number
  drawerTransitionTime: number
  onMenuOpen?: () => void
}

export function Topbar (props: ITopbarProps) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const colorMode = useContext(ColorModecontext)

    const height = 5;

  return (
    <Box sx={{width:"100%", height: `${height}vh`}}>

      <AppBar position="absolute" 
        sx={{height: '5vh', width: `calc(100vw - ${props.drawerWidth}vw)`, bgcolor: theme.palette.primary.main,
        transition: `width ${props.drawerTransitionTime}ms ease-out`
        
      }}>
        <Box sx={{height: `${height}vh`}} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => {if (props.onMenuOpen !== undefined) props.onMenuOpen()}}>
              <MenuIcon/>
            </IconButton>
            <Typography variant='h3' color={colors.white[200]} ml="2vh">
              LifeCom
            </Typography>
          </Box>
          <span/>
          <Box display="flex">
            <IconButton>
              <AccountCircle/>
            </IconButton>
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
