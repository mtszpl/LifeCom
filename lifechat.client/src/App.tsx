import { ColorModecontext, useMode } from './Theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';
import MainPage from './pages/MainPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { useEffect } from 'react';
import { MainDefault } from './components/MainDefault';
import { MessageChannel } from './components/MessageChannel';
import { NotFound } from './pages/NotFound';
import { UserPage } from './pages/UserPage';

function App() {
    const [theme, colorMode] = useMode()

    const condition = true

    useEffect(() => {
        const mode = localStorage.getItem("theme")
        if(mode)
            colorMode.setColorMode(mode)
    }, [theme])

    return (
        <ColorModecontext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>                    
                    <Provider store={store}>
                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
                            <Route path="/main" element={<MainPage/>}>
                                <Route index element={<MainDefault/>}/>
                                <Route path=":username"/>
                                <Route path="channel/:id" element={<MessageChannel/>}/>
                                <Route path="user" element={<UserPage/>}/>
                            </Route>
                            <Route path="/login" element={
                                condition ? <LoginPage/> : <Navigate to={"/"}/>
                            }/>
                            <Route path="/register" element={<RegisterPage/>}/>
                            <Route path="/*" element={<NotFound/>}/>
                        </Routes>
                    </Provider>
            </ThemeProvider>
        </ColorModecontext.Provider>
    );

}

export default App;