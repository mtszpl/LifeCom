import { Box, Theme, useTheme } from "@mui/material";
import { useDispatch, useSelector,  } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Topbar } from "../components/global/Tobpar";
import { ContactsDrawer } from "../components/global/ContactsDrawer/ContactsDrawer";
import Interceptors from "../API/Interceptors";
import { setLoggedIn, setToken, setUser } from "../store/slices/UserSlice";
import HttpClient from "../API/HttpClient";
import { SignalConnector } from "../API/SignalConnector";
import LoginUtils from "../utility/LoginUtils";

function MainPage() {

    const theme: Theme = useTheme()
    const dispatch = useDispatch()
    const isLogged = useSelector(state => state.userData.loggedIn)

    const reroute = useNavigate()
    
    useEffect(() => {
        const remember = localStorage.getItem("remember")
        
        // const token = localStorage.getItem("token")
        if((remember === null || remember === undefined) && !isLogged) {
            localStorage.removeItem("token")
            localStorage.removeItem("remember")
            reroute("/")
            return
        }
        else if(remember && !isLogged) {
            const subsciption = LoginUtils.login({
                username: "",
                password: "",
                email: ""})
                .subscribe({
                    error(err: Error) {
                        console.error(err)
                        reroute("/")
                    },
                    complete() {
                        subsciption.unsubscribe()
                        Interceptors.addAuthInterceptor()
                        reroute("/main")
                    }
                });
        }
    },[])

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [contentOffset, setContentOffset] = useState<number>(0)
    const drawerWidth: number = 20
    const drawerTransitionTime: number = 400
    const barHeight: number = 5


    useEffect(() => {
        drawerOpen === true ? setContentOffset(drawerWidth) :
            setContentOffset(0)
    }, [drawerOpen])

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }
    
    const updateDrawer = (newState: boolean) => {
        setDrawerOpen(newState)
    }

    return (
        <Box     
            display="flex"
            flexDirection="column"
            sx={{
                height: '100%',
                marginLeft: `${contentOffset}%`,
                transition: `margin-left ${drawerTransitionTime}ms ease-in-out`,
                bgcolor: theme.palette.background.default
            }}>
            <ContactsDrawer 
                height={barHeight}
                open={drawerOpen}
                width={drawerWidth}
                transitionTime={drawerTransitionTime}
                handleClose={updateDrawer}/>
            <Box sx={{width:"100%", height: `${barHeight}vh`, position: 'relative'}}>
                <Topbar height={barHeight} onMenuOpen={toggleDrawer} drawerWidth={ drawerOpen === true ? drawerWidth : 0} drawerTransitionTime={drawerTransitionTime}/> 
            </Box>

            <Box width="100%" height="96%" display="flex" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.light}>
                <Outlet/>
            </Box>

        </Box>
    )
}

export default MainPage;