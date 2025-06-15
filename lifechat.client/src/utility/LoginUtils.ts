import { map } from "rxjs";
import HttpClient from "../API/HttpClient";
import Interceptors from "../API/Interceptors";
import { SignalConnector } from "../API/SignalConnector";
import store from "../store/store";

export default class Login {

    static loginUrl: string = `${HttpClient.baseApiUrl}/Auth/login`

    static login = (loginParams: {
        username: string | undefined | null,
        email: string | undefined | null,
        password: string,
    }) => {
        return HttpClient.post(this.loginUrl, loginParams)
            .pipe(map(user => {
                this.loginDetails(user)
                return user
            }))
    }

    static loginDetails = (response) => {
        store.dispatch({ type: 'user/setLoggedIn', payload: true})
        if(response.user !== undefined){
            store.dispatch({ type: 'user/setUser', payload: response.user})
        }
        if(response.token !== undefined){
            store.dispatch({ type: 'user/setToken', payload: response.token})
        }
        SignalConnector.buildConnection()
    }
    
    static setToken = (token) => {        
        localStorage.setItem("token", token)
        store.dispatch({ type: 'user/setToken', payload: token})
    }

    static logoutDetails = () => {
        store.dispatch({ type: 'user/setLoggedIn', payload: false})
        store.dispatch({ type: 'user/setUsern', payload: undefined})
        store.dispatch({ type: 'user/setToken', payload: undefined})
        localStorage.removeItem("token")

        Interceptors.removeAuthInterceptor()
    }
}