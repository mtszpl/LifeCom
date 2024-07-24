import Interceptors from "../API/Interceptors";
import store from "../store/store";

export default class Login {

    static loginDetails = (response) => {
        console.log("response");
        console.log(response);
        console.log(response.token !== undefined);

        store.dispatch({ type: 'user/setLoggedIn', payload: true})
        if(response.user !== undefined){
            console.log(`setting user to: ${response.user}`);
            store.dispatch({ type: 'user/setUser', payload: response.user})
            console.log(`user set to: ${store.getState().userData.user}`)
        }
        if(response.token !== undefined){
            console.log(`setting token to: ${response.token}`);
            store.dispatch({ type: 'user/setToken', payload: response.token})
            localStorage.setItem("token", response.token)
            // store.dispatch({type: "connector/retryConnection", payload: response.token})
        }
    }
    
    static setToken = (token) => {        
        localStorage.setItem("token", token)
        store.dispatch({ type: 'user/setToken', payload: token})
        // store.dispatch({type: "connector/retryConnection", token})
    }

    static logoutDetails = () => {
        store.dispatch({ type: 'user/setLoggedIn', payload: false})
        store.dispatch({ type: 'user/setUsern', payload: undefined})
        store.dispatch({ type: 'user/setToken', payload: undefined})
        localStorage.removeItem("token")

        Interceptors.removeAuthInterceptor()
    }
}