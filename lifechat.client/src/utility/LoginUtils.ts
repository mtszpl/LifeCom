import Interceptors from "../API/Interceptors";
import store from "../store/store";

export default class Login {

    static loginDetails = (response) => {
        store.dispatch({ type: 'user/setLoggedIn', payload: true})
        if(response.username !== undefined){
            console.log(`setting username to: ${response.username}`);
            store.dispatch({ type: 'user/setUsername', payload: response.username})
            console.log(`username set to: ${store.getState().user.name}`)
        }
        if(response.token !== undefined)
            store.dispatch({ type: 'user/setToken', payload: response.token})
        localStorage.setItem("token", response.token)
    }

    static setToken = (token) => {
        store.dispatch({ type: 'user/setToken', payload: token})
    }

    static logoutDetails = () => {
        store.dispatch({ type: 'user/setLoggedIn', payload: false})
        store.dispatch({ type: 'user/setUsername', payload: undefined})
        store.dispatch({ type: 'user/setToken', payload: undefined})
        localStorage.removeItem("token")

        Interceptors.removeAuthInterceptor()
    }
}