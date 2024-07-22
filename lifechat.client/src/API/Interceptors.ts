import axios from "axios";
import store from "../store/store";
import LoginUtils from "../utility/LoginUtils";
import HttpClient from "./HttpClient";
import { from } from "rxjs";

export default class Inteceptors {

    static addedRequestInerceptors = []
    static addedResponseInerceptors = []

    private static authInterceptor: number | undefined
    private static authUrls = ['/login', '/register']
    
    private static refreshInterceptor: number | undefined
    private static refreshUrl = ['/refresh']

    static clearInterceptors () {
        HttpClient.ejectAllInteceptors()
    }

    static addAuthInterceptor = (key?: string) => {
        if(this.authInterceptor !== undefined){
            console.error("Auth interceptor already added")
            return
        }
        let token: any
        if(key)
            token = localStorage.getItem(key)
        else
            token = store.getState().user.token
        console.log(token);
        this.authInterceptor = HttpClient.addRequestInterceptor((config) => {
            console.log("intercepting");
            if(this.authUrls.some(url => config.url.includes(url)))
                return config
            if(token)
                config.headers.Authorization = `Bearer ${token}`
            console.log(config);
            return config
        })

        this.addedRequestInerceptors.push(this.authInterceptor)

        this.addRefreshInterceptor()
    }

    static removeAuthInterceptor = () => {
        if(this.authInterceptor === undefined){
            console.error("No auth interceptor")
            return
        }
        HttpClient.removeRequestInterceptor(this.authInterceptor)
        this.authInterceptor = undefined
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
            if(error.response.status === 401 && !originalRequest._retry) {   
                originalRequest._retry = true
                const token = store.getState().user.token
                
                try{

                    const refreshResponse = await axios.get("https://localhost:7078/api/Auth/refresh", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        withCredentials: true
                    })
                    
                    const newToken = refreshResponse.data
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                    
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