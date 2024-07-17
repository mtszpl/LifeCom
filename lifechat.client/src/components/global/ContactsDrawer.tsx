import { useTheme } from '@emotion/react';
import { ChevronLeft } from '@mui/icons-material';
import { Box, Drawer, IconButton } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';


interface IDrawerProps {
  open: boolean
  width: number 
  transitionTime? : number
  handleClose?: (newState: boolean) => void
}

export function ContactsDrawer (props: IDrawerProps) {

  // React.useEffect(() => console.log(open), [open])
  const theme = useTheme()

  const [drawerOpen, setDrawerOpen] = useState<boolean>(props.open)
  useEffect(() => setDrawerOpen(props.open), [props.open])

  const toggleOpen = () => {
    setDrawerOpen(!drawerOpen)
    props.handleClose(!drawerOpen)
  }

  return (
    <Drawer
      sx={{
        width: `${props.width}vw`,
        flexShrink: 0,
        bgcolor: theme.palette.background,
        '& .MuiDrawer-paper': {
          width: `${props.width}vw`,
          boxSizing: "border-box"
        }
      }}
      variant="persistent"
      anchor="left"
      open={props.open}
      transitionDuration={props.transitionTime !== undefined ? props.transitionTime : 300}
      >
        <Box display="flex" alignItems="center" height="5vh" justifyContent="flex-end" bgcolor={theme.palette.primary.main}>
          Contacts
          <IconButton onClick={() => toggleOpen()}>
            <ChevronLeft/>
          </IconButton>
        </Box>
    </Drawer>
  );
}
