import axios from "axios"
import { first, from, map } from "rxjs"

/**
 * Class used for executing API calls and returning data as RxJs observable
 */
export default class HttpClient {

    private static API = axios.create({baseURL: ""})

    /**
     * Adds request interceptor to API call
     * @param interceptor Interceptor function
     * @param errorHandle Error handle function
     * @returns 
     */
    static addRequestInterceptor = (interceptor: (response) => any, errorHandle?: (error) => any = undefined) => {
        return HttpClient.API.interceptors.request.use(interceptor, errorHandle)
    }

    /**
     * Adds response interceptor to API call
     * @param interceptor Interceptor function
     * @param errorHandle Error handle function
     * @returns 
     */
    static addResponseInterceptor = (interceptor: (response) => any, errorHandle?: (error) => any = undefined) => {
        return HttpClient.API.interceptors.response.use(interceptor, errorHandle)
    }

    /**
     * Removes request interceptor from API calls
     * @param interceptor Interceptor to remove
     */
    static removeRequestInterceptor = (interceptor) => {
        HttpClient.API.interceptors.request.eject(interceptor)
        console.log(`Request interceptors: ${HttpClient.API.interceptors.request.handles}`);
    }
    
    /**
     * Removes response interceptor from API calls
     * @param interceptor Interceptor to remove
    */
   static removeResponseInterceptor = (interceptor) => {
       HttpClient.API.interceptors.response.eject(interceptor)
       console.log(`Response interceptors: ${HttpClient.API.interceptors.response.handles}`);
    }

    /**
     * Executes 'get' request
     * @param url Endpoint url
     * @param getFirst If true returns only first value, default true
     * @returns Observable with data from call or error message if occured
     */
    static get = (url: string, getFirst: boolean = true) => {     
        const axiosPromise = HttpClient.API.get(url)
        return from(axiosPromise.then(response => {
            return response.data
        }).catch(error => {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText)
            } else {
                throw new Error(error.message)
            }
        })).pipe( getFirst ?
              first() :
              map(data => data)
            )
    }

    /**
     * Executes 'post' request
     * @param url Endpoint url
     * @param payload Request payload
     * @param contentType Content type of request, default application/json
     * @returns Observable with data from call or error message if occured
     */
    static post = (url: string, payload: unknown, contentType: string = "application/json") => {
        const axiosPromise = HttpClient.API.post(url, payload)        

        return from(axiosPromise.then(response => {
            return response.data;
        }).catch(error => {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText)
            } else {
                throw new Error(error.message)
            }
        }))}


}