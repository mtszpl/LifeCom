import { ChevronLeft } from '@mui/icons-material';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import * as React from 'react';

export interface IDrawerHeaderProps {
    height: number | undefined
    handleOpen: () => void
}

export function DrawerHeader (props: IDrawerHeaderProps) {
  const theme = useTheme()

  return (
    <Box display="flex" alignItems="center" height={`${ props.height ?? 5 }vh`} padding="1vh" justifyContent="flex-end" bgcolor={theme.palette.background.dark}>
        <Typography variant="h3">
        Contacts
        </Typography>
        <IconButton onClick={() => props.handleOpen()}>
            <ChevronLeft/>
        </IconButton>
</Box>
  );
}
