import { Box } from '@mui/material';
import * as React from 'react';
import defaultAvatar from '../assets/defaultAvatar.png';
import HttpClient from '../API/HttpClient';
import { first } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
import { setProfilePicture } from '../store/slices/ProfilePictureSlice';


export interface IProfilePictureProps {
    width?: number
    sx? :object
    onClick?: (arg0: any) => void
}

export function ProfilePicture (props: IProfilePictureProps) {

    const dispatch = useDispatch()
    const profilePicture = useSelector(state => state.profilePictureContainer.profilePicture)
    const store = useSelector(state => state)

    const[pp, setPp] = React.useState<string | undefined>(undefined)

    const url: string = "https://localhost:7078/api/Images"

    React.useEffect(() => {
        HttpClient.get(url)
            .pipe(first()).subscribe(response => {
                if(response !== "")
                    dispatch(setProfilePicture(`data:image/jpeg;base64, ${response}`))
                else
                    dispatch(setProfilePicture(null))
                setPp(`data:image/jpeg;base64, ${response}`)
            })
    }, [])

  return (
    <Box
        sx={props.sx}
        component="img"
        src={ (profilePicture !== undefined  && profilePicture !== null) ?
            profilePicture :
             defaultAvatar }
        onClick={(e) => {if (props.onClick !== undefined) props.onClick(e)}}
        />        
  );
}
