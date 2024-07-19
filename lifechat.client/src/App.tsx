import { ColorModecontext, useMode } from './Theme';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';
import MainPage from './pages/MainPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';

function App() {
    const [theme, colorMode] = useMode()

    const condition = true

    return (
        <ColorModecontext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>                    
                    <Provider store={store}>
                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
                            <Route path="/main" element={<MainPage/>}/>
                            <Route path="/login" element={
                                condition ? <LoginPage/> : <Navigate to={"/"}/>
                            }/>
                            <Route path="/register" element={<RegisterPage/>}/>
                        </Routes>
                    </Provider>
            </ThemeProvider>
        </ColorModecontext.Provider>
    );

}

export default App;