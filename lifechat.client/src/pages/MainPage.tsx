import { Box, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendToConnection, setConnector } from "../store/slices/ConnectorSlice";
import { SignalConnector } from "../API/SignalConnector";
import { Topbar } from "../components/global/Tobpar";
import { ContactsDrawer } from "../components/global/ContactsDrawer";

function MainPage() {

    const theme = useTheme()
    useEffect(() => {
        const signalConnector = new SignalConnector()
        dispatch(setConnector(signalConnector))
    },[])

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [contentOffset, setContentOffset] = useState(0)
    const drawerWidth: number = 20
    const drawerTransitionTime: number = 400

    useEffect(() => {
        drawerOpen === true ? setContentOffset(drawerWidth) :
            setContentOffset(0)
        console.log(drawerOpen, contentOffset);
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
        // <Container /*sx={{width:"100vw", height:"100%", bgcolor:"tomato" /*{theme.palette.background.default}}}*/>       

        <Box sx={{width: '100%', height: '100%'}}>
            <ContactsDrawer open={drawerOpen} width={drawerWidth} handleClose={updateDrawer} transitionTime={drawerTransitionTime} ></ContactsDrawer>
            <Topbar onMenuOpen={toggleDrawer} drawerWidth={ drawerOpen === true ? drawerWidth : 0} drawerTransitionTime={drawerTransitionTime}></Topbar>
            <Box className="content" 
            display="flex"
            flexDirection="column"
            sx={{
                height: '100%',
                marginLeft: `${contentOffset}%`,
                transition: `margin-left ${drawerTransitionTime}ms ease-in-out`
            }}
            >
                eeeee
                    <input type="text" />
                    <button onClick={(e) => send("eee")}>Send</button>
            </Box>
        </Box>
    )
}

export default MainPage;