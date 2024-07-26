import { Add } from '@mui/icons-material';
import { FormControl, Box, InputLabel, Select, MenuItem, Typography, Divider, useTheme, SelectChangeEvent } from '@mui/material';
import Chat from '../../../model/Chat';

export interface IChatSelectorProps {
    chatTuples: {chat: Chat, role: string}[]
    selectedChat: {chat: Chat | undefined, role: string}
    handleChatSelect: (e: SelectChangeEvent) => void
}

export function ChatSelector (props: IChatSelectorProps) {
    const theme = useTheme()

    const noChatTuple = {
      chat: undefined,
      role: "None"
    }
    const addChatTuple = {
      chat: undefined,
      role: "Add"
    }

  return (
    <FormControl fullWidth variant="filled">
    <Box borderBottom="solid" bgcolor={theme.palette.primary.main}>
      <InputLabel>Chat</InputLabel>
      <Select 
        label="Chat"
        value={props.selectedChat}
        onChange={e => props.handleChatSelect(e)}
        sx={{
          textAlign: "left",
          width: "95%",
          marginBottom: "1vh",
          color: theme.palette.secondary.main
        }}>
          <MenuItem value={noChatTuple}>
            <Typography>
              {noChatTuple.role}
            </Typography>
          </MenuItem>
          <Divider/>
          {
            props.chatTuples.map((chatTuple, idx) => (
                <MenuItem value={chatTuple} key={idx}>
                  <Typography>
                    {chatTuple.chat.name}
                  </Typography>
                </MenuItem>
            ))
          }
          <Divider/>
          <MenuItem value={addChatTuple} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Typography>Add</Typography>
            <Add/>
          </MenuItem>
      </Select>
    </Box>
  </FormControl>
  );
}
