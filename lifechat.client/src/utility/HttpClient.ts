import axios from "axios"
import { first, from, map } from "rxjs"

export default class HttpClient {
    static get = (url: string, getFirst: boolean = true) => {
        const fetchPromise = fetch(url)
        const axiosPromise = axios.get(url)


        return from(axiosPromise).pipe( getFirst ?
              first() :
              map(data => data)
            )
    }

    static post = (url: string, payload: unknown) => {
        const fetchPromise = fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
        return from(fetchPromise.then(response => {
            if(!response.ok){
                return response.text().then(text => {
                    throw new Error(text || response.statusText )
                })
            }
            return response.text()
        }))
    }
}