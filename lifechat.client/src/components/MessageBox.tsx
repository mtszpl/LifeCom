import { Box, Typography, useTheme } from '@mui/material';
import Message from '../model/Message';
import { useSelector } from 'react-redux';

export interface IMessageBoxProps {
  message: Message
}

export function MessageBox (props: IMessageBoxProps) {
    const theme: Theme = useTheme()

    const stateUser = useSelector(state => state.userData.user)

  return (
    <Box
      width="95%"
      paddingY="1vh"
      paddingX="1vw"
      borderRadius="12px"
      display="flex"
      flexDirection="column"
      marginX="auto"
      bgcolor={theme.palette.background.default}
      // height="50vh"
      // minHeight="60px"
      >
      <Typography
        color={theme.palette.primary.light} marginBottom="1vh" alignSelf={stateUser?.username === props.message.author.username ? "flex-end" : "flex-start"}>
        {props.message.author.username}
      </Typography>
      <Typography align='justify'>
        {props.message.content}
      </Typography>
    </Box>
  );
}
