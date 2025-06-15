/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios"
import { from } from "rxjs"
import { SignalConnector } from "./SignalConnector"

/**
 * Class used for executing API calls and returning data as RxJs observable
 */
export default class HttpClient {

    private static API = axios.create({baseURL: ""})

    public static baseApiUrl: string = "https://localhost:7078/api"
    public static serverUrl: string = "https://localhost:7078"

    static listInterceptors() {
        console.log(SignalConnector)
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

    
    private static processParams =(params: any) => {
        if(params === undefined)
            params = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        else 
            params.withCredentials = true 
        return params
    }

    private static executeRequest = (axiosPromise: Promise<AxiosResponse<any, any>>) => {
        return from(axiosPromise.then(response => {
            return response.data ?? null
        }).catch(error => {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText)
            } else {
                throw new Error(error.message)
            }
        }))
    }

    private static request = (method: "get" | "post" | "put" | "delete", url: string, params?: any, payload?: any) => {
        params = HttpClient.processParams(params);
        let axiosPromise
        console.log(params);
        switch(method){
            case "get":
                axiosPromise = HttpClient.API.get(url, params)
                break;
            case "post":
                axiosPromise = HttpClient.API.post(url, payload, params)
                break;
            case "put":
                axiosPromise = HttpClient.API.put(url, payload, params)
                break;
            case "delete":
                axiosPromise = HttpClient.API.delete(url, { data:payload,  ...params })
                break;
        }
        // axios({method: method, url: url, data: payload, headers: params.headers})
        return HttpClient.executeRequest(axiosPromise)
    }
    
    /**
     * Executes 'get' request
     * @param url Endpoint url
     * @param params Request parameters, default withCredentials with content-type "application/json"
     * @returns Observable with data from call or error message if occured
     */
    static get = (url: string, params: any = undefined) => {    
        return HttpClient.request('get', url, params)
    }

    /**
     * Executes 'post' request
     * @param url Endpoint url
     * @param payload Request payload
     * @param params Request parameters, default withCredentials with content-type "application/json"
     * @returns Observable with data from call or error message if occured
     */
    static post = (url: string, payload: unknown, params: any = undefined) => {
        return HttpClient.request('post', url, params, payload)
    }

    /**
     * Executes put method
     * @param url Endpoint url
     * @param payload Request payload
     * @param params Request parameters, default withCredentials with content-type "application/json"
     * @returns Observable with data from call or error message if occured
     */
    static put = (url: string, payload: any, params: any = undefined) => {
        return HttpClient.request('put', url, params, payload)
    }
    
    static delete = (url: string, payload: any =  undefined) => {
        return HttpClient.request('delete', url, undefined, payload);
    }


}