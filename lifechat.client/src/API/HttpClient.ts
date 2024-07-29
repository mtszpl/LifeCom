/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { from } from "rxjs"

/**
 * Class used for executing API calls and returning data as RxJs observable
 */
export default class HttpClient {

    private static API = axios.create({baseURL: ""})

    static listInterceptors() {
        console.log(HttpClient.API.interceptors.request);
        console.log(HttpClient.API.interceptors.response);
    }

    static ejectAllInteceptors() {
        this.API.interceptors.request.clear()
        this.API.interceptors.response.clear()
    }

    /**
     * Adds request interceptor to API call
     * @param interceptor Interceptor function
     * @param errorHandle Error handle function
     * @returns 
     */
    static addRequestInterceptor = (interceptor: (response: any) => any, errorHandle?: (error: any) => any) => {
        return HttpClient.API.interceptors.request.use(interceptor, errorHandle)
    }

    /**
     * Adds response interceptor to API call
     * @param interceptor Interceptor function
     * @param errorHandle Error handle function
     * @returns 
     */
    static addResponseInterceptor = (interceptor: (response: any) => any, errorHandle?: (error: any) => any) => {
        return HttpClient.API.interceptors.response.use(interceptor, errorHandle)
    }

    /**
     * Removes request interceptor from API calls
     * @param interceptor Interceptor to remove
     */
    static removeRequestInterceptor = (interceptor: number) => {
        HttpClient.API.interceptors.request.eject(interceptor)
    }
    
    /**
     * Removes response interceptor from API calls
     * @param interceptor Interceptor to remove
    */
   static removeResponseInterceptor = (interceptor:number) => {
       HttpClient.API.interceptors.response.eject(interceptor)
    }

    static request (request: Promise<any>) {
        return from(request)
    }

    /**
     * Executes 'get' request
     * @param url Endpoint url
     * @param params Request parameters, default withCredentials with content-type "application/json"
     * @returns Observable with data from call or error message if occured
     */
    static get = (url: string, params: any = undefined) => {    
        if(params === undefined)
            params = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        else 
            params.withCredentials = true 
        const axiosPromise = HttpClient.API.get(url, params)
        return from(axiosPromise.then(response => {
            return response.data
        }).catch(error => {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText)
            } else {
                throw new Error(error.message)
            }
        }))
    }

    /**
     * Executes 'post' request
     * @param url Endpoint url
     * @param payload Request payload
     * @param params Request parameters, default withCredentials with content-type "application/json"
     * @returns Observable with data from call or error message if occured
     */
    static post = (url: string, payload: unknown, params: any = undefined) => {
        if(params === undefined)
            params = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        else 
            params.withCredentials = true
        
        const axiosPromise = HttpClient.API.post(url, payload, params)
        return from(axiosPromise.then(response => {
            return response.data;
        }).catch(error => {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText)
            } else {
                throw new Error(error.message)
            }
        }))
    }

    /**
     * Executes put method
     * @param url Endpoint url
     * @param payload Request payload
     * @param params Request parameters, default withCredentials with content-type "application/json"
     * @returns Observable with data from call or error message if occured
     */
    static put = (url: string, payload: any, params: any = undefined) => {
        if(params === undefined)
            params = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        else 
            params.withCredentials = true
        const axiosPromise = HttpClient.API.put(url, payload, params)
        return from(axiosPromise.then(response => {
            console.log(response);
        }))
    }


}