import { Autocomplete, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import * as React from 'react';
import Channel from '../../model/Channel';
import HttpClient from '../../API/HttpClient';

export interface IChannelManagerDialogProps {
  isOpen: boolean,
  mode?: EMode,
  channel: Channel,
  onClose: () => void
}

export enum EMode {
  add,
  remove,
  changeRole
}

export function ChannelManagerDialog (props: IChannelManagerDialogProps) {
  const url: string = "https://localhost:7078/api/users/byName"


  const [matchingUsers, setMatchingUsers] = React.useState<[]>([])
  const [selectedUser, setSelectedUser] = React.useState(undefined)

  const searchUser = (e) => {
    const userName = e.target.value
    if(userName.length >= 3){
      HttpClient.get(`${url}?namePart=${userName}`).subscribe({
        next: (data) => {
          const usersList = [...data]
          setMatchingUsers(usersList)
        }
      })
    }
    else
      setMatchingUsers([])
  }

  const titleDescription = () => {
    switch(props.mode){
      case(EMode.add):
        return "Add user to channel "
      case(EMode.remove):
        return "Remove user from channel "
      case(EMode.changeRole):
        return "Change user role in channel "
      default:
        return "Error"
    }
  }

  return (
    <Dialog open={props.isOpen}
      onClose={props.onClose}
    >
      <DialogTitle variant='h3'>
        {titleDescription()}
        {props.channel.name}
      </DialogTitle>
      <DialogContent>
        {
          selectedUser ? selectedUser.username : null
        }
        <Autocomplete 
          options={matchingUsers}
          getOptionLabel={option => option.username}
          onChange={(e, newSelectedUser) => setSelectedUser(newSelectedUser)}
          onInputChange={e => searchUser(e)}
          renderInput={(params) => <TextField {...params} label="Username" />}
          />
      </DialogContent>
    </Dialog>
  );
}
