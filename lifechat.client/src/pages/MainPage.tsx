import { Box, Button, TextField, Theme, useTheme } from "@mui/material";
import { useDispatch, useSelector,  } from "react-redux";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendToConnection, setConnector } from "../store/slices/ConnectorSlice";
import { SignalConnector } from "../API/SignalConnector";
import { Topbar } from "../components/global/Tobpar";
import { ContactsDrawer } from "../components/global/ContactsDrawer";
import { SendSharp } from "@mui/icons-material";
import Interceptors from "../API/Interceptors";
import { setLoggedIn, setToken, setUsername } from "../store/slices/UserSlice";
import HttpClient from "../API/HttpClient";

function MainPage() {

    const theme: Theme = useTheme()
    const dispatch = useDispatch()
    const storeToken = useSelector(state => state.user.token)
    const isLogged = useSelector(state => state.user.loggedIn)

    const reroute = useNavigate()
    
    useEffect(() => {
        const remember = localStorage.getItem("remember")
        console.log(remember);
        console.log(storeToken);
        
        const signalConnector = new SignalConnector()
        dispatch(setConnector(signalConnector))
        
        const token = localStorage.getItem("token")
        console.log(`remember :${(remember === null || remember === undefined) && (storeToken === null || storeToken === undefined)}`);
        if((remember === null || remember === undefined) && !isLogged) {
            localStorage.removeItem("token")
            localStorage.removeItem("remember")
            console.log("rerouting to landing");
            reroute("/")
            return
        }
        else if(token && !isLogged) {
            dispatch(setToken(token))
            console.log("setting stuff");
            Interceptors.addAuthInterceptor("token")
            const subscription = HttpClient.get("https://localhost:7078/api/Users")
                .subscribe({
                    next(response) {
                        dispatch(setUsername(response))
                        dispatch(setToken(token))
                        dispatch(setLoggedIn(true))
                        localStorage.setItem("token", token)
                    },
                    error(err) {
                        console.error(err.message)
                    },
                    complete() {
                        subscription.unsubscribe()
                        dispatch(setLoggedIn(true))
                    }
                })
        }
    },[])

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [contentOffset, setContentOffset] = useState<number>(0)
    const drawerWidth: number = 20
    const drawerTransitionTime: number = 400

    useEffect(() => {
        drawerOpen === true ? setContentOffset(drawerWidth) :
            setContentOffset(0)
    }, [drawerOpen])

    const send = (message: string) => {
        dispatch(sendToConnection(message))
    }

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }
    
    const updateDrawer = (newState: boolean) => {
        setDrawerOpen(newState)
    }

    return (
        <Box sx={{width: '100%', height: '100%', display: "flex", flexDirection: "column"}}>
            <ContactsDrawer height={5} open={drawerOpen} width={drawerWidth} handleClose={updateDrawer} transitionTime={drawerTransitionTime} ></ContactsDrawer>
            <Topbar height={5} onMenuOpen={toggleDrawer} drawerWidth={ drawerOpen === true ? drawerWidth : 0} drawerTransitionTime={drawerTransitionTime}></Topbar>
            <Box className="content" 
            display="flex"
            flexDirection="column"
            sx={{
                height: '100%',
                marginLeft: `${contentOffset}%`,
                transition: `margin-left ${drawerTransitionTime}ms ease-in-out`,
                bgcolor: theme.palette.background.default
            }}
            >   
                <Box className="messages" height="100%" bgcolor={theme.palette.background.default}>
                    messages
                </Box>
                <Box marginTop="auto" display="flex" marginX="1vw" marginBottom="1vh" bgcolor={theme.palette.background.default} paddingTop="1vh">
                    <TextField sx={{ width: "100%",  }} />
                    <Button variant="contained" sx={{ bgcolor: theme.palette.primary.light, marginLeft: "0.3vw" }} onClick={(e) => send("eee")}>
                        <SendSharp fontSize="large"/>
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default MainPage;