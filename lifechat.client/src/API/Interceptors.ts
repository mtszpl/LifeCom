import axios from "axios";
import store from "../store/store";
import HttpClient from "./HttpClient";

export default class Inteceptors {

    static addedRequestInerceptors = []
    static addedResponseInerceptors = []

    private static authInterceptorHandle: number | undefined
    private static authUrls = ['/login', '/register']
    
    private static refreshInterceptor: number | undefined
    private static refreshUrl = ['/refresh']

    static clearInterceptors () {
        HttpClient.ejectAllInteceptors()
    }

    static addAuthInterceptor = (key?: string) => {
        if(this.authInterceptorHandle !== undefined){
            console.error("Auth interceptor already added")
            return
        }
        let token: any
        if(key)
            token = localStorage.getItem(key)
        else
            token = store.getState().userData.token
        this.authInterceptorHandle = HttpClient.addRequestInterceptor(config => Inteceptors.authInterceptor(config, token))

        this.addedRequestInerceptors.push(this.authInterceptorHandle)

        this.addRefreshInterceptor()
    }

    private static authInterceptor = (config, token) => {
        if(this.authUrls.some(url => config.url.includes(url)))
            return config
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config        
    }

    static removeAuthInterceptor = () => {
        console.log("removing auth");
        if(this.authInterceptorHandle === undefined){
            console.error("No auth interceptor")
            return
        }
        HttpClient.removeRequestInterceptor(this.authInterceptorHandle)
        this.authInterceptorHandle = undefined
    }
    
    static addRefreshInterceptor() {
        if(this.refreshInterceptor !== undefined) {
            console.error("Refresh interceptor already added")
            return
        }
        
        this.refreshInterceptor = HttpClient.addResponseInterceptor(config => {
            return config
        }, async error => {
            const { config, response: { status } } = error;
            const originalRequest = config;
            if(this.refreshUrl.some(url => error.config.url.includes(url)))
                return
            if((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {   
                originalRequest._retry = true
                const token = store.getState().userData.token
                
                try{
                    
                    const refreshResponse = await axios.get(`${HttpClient.baseApiUrl}/Auth/refresh`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        withCredentials: true
                    })
                                        
                    const newToken = refreshResponse.data
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                    localStorage.setItem("token", newToken)
                    store.dispatch({ type: 'user/setToken', payload: newToken})
                    const retryApi = axios.create({
                        baseURL: error.config.url,
                        withCredentials: true
                    })
                    return retryApi(originalRequest)
                } catch (refreshError) {
                    return Promise.reject(refreshError)
                }
            }       
        })
        this.addedResponseInerceptors.push(this.refreshInterceptor)
    }
    
    static removeRefreshInterceptor () {
        if(this.refreshInterceptor === undefined) {
            console.error("No refresh interceptor")
            return
        }
        HttpClient.removeResponseInterceptor(this.refreshInterceptor)
        this.refreshInterceptor = undefined
    }

}