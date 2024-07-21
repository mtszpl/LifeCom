import store from "../store/store";
import HttpClient from "../utility/HttpClient";

export default class Inteceptors {

    static addedInerceptors = []

    private static authInterceptor: number | undefined
    private static authUrls = ['/login', '/register']

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

        this.authInterceptor = HttpClient.addRequestInterceptor((config) => {
            if(this.authUrls.some(url => config.url.includes(url)))
                return config
            if(token)
                config.headers.Authorization = `Bearer ${token}`
            return config
        })

        this.addedInerceptors.push(this.authInterceptor)
    }

    static removeAuthInterceptor = () => {
        if(this.authInterceptor === undefined){
            console.error("No auth interceptor")
            return
        }
        HttpClient.removeRequestInterceptor(this.authInterceptor)
    }
}