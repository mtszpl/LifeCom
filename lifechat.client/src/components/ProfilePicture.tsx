import { Box } from '@mui/material';
import * as React from 'react';
import defaultAvatar from '../assets/defaultAvatar.png';
import HttpClient from '../API/HttpClient';
import { first } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
import { setProfilePicture } from '../store/slices/ProfilePictureSlice';
import User from '../model/User';


export interface IProfilePictureProps {
    width?: number
    sx? :object
    onClick?: (arg0: any) => void
}

export function ProfilePicture (props: IProfilePictureProps) {

    const dispatch = useDispatch()
    const user$ = useSelector(state => state.userData.user$)
    const profilePicture = useSelector(state => state.profilePictureContainer.profilePicture)

    const url: string = `${HttpClient.baseApiUrl}/Images`

    React.useEffect(() => {
        const subscription = user$.subscribe({
            next: (newUser: User | undefined) => {
                if(newUser) {
                    HttpClient.get(url)
                        .pipe(first()).subscribe(response => {
                            if(response !== "")
                                dispatch(setProfilePicture(`data:image/jpeg;base64, ${response}`))
                            else
                                dispatch(setProfilePicture(null))
                        })
                    }
            }
        });

        return () => subscription.unsubscribe();
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
