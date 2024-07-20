import { Box, Button, TextField, Theme, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendToConnection, setConnector } from "../store/slices/ConnectorSlice";
import { SignalConnector } from "../API/SignalConnector";
import { Topbar } from "../components/global/Tobpar";
import { ContactsDrawer } from "../components/global/ContactsDrawer";
import { SendSharp } from "@mui/icons-material";

function MainPage() {

    const theme: Theme = useTheme()
    useEffect(() => {
        const signalConnector = new SignalConnector()
        dispatch(setConnector(signalConnector))
    },[])

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [contentOffset, setContentOffset] = useState<number>(0)
    const drawerWidth: number = 20
    const drawerTransitionTime: number = 400

    useEffect(() => {
        drawerOpen === true ? setContentOffset(drawerWidth) :
            setContentOffset(0)
    }, [drawerOpen])

    const dispatch = useDispatch()

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