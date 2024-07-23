import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export class SignalConnector {

    connection: HubConnection | undefined = undefined

    constructor() {
        const token = localStorage.getItem("token")
        if(token === null)
            return
        this.connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7078/hub", {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            accessTokenFactory: () => {
                const token = localStorage.getItem("token")
                return token
            }
            })
        .build()


        this.connection!.start().then(() => console.log("connected")).catch( (e: any) => console.log(`fug, ${e}`))

        this.connection!.on("ReceiveMessage", (author, content) => {
            console.log(`Received`)
            console.log(author);
            console.log(content);
        })
    }

    // retryConnection (token?: string) {
    //     let localToken: string | null | undefined = token
    //     if(localToken === null)
    //         localToken = localStorage.getItem("token")
    //     if(this.connection !== undefined) {
    //         this.connection.stop()
    //     }

    //     this.connection = new HubConnectionBuilder()
    //     .withUrl("https://localhost:7078/hub", {
    //         skipNegotiation: true,
    //         transport: HttpTransportType.WebSockets,
    //         accessTokenFactory: () => localToken
    //         })
    //     .build()

    //     this.connection!.start().then(() => console.log("connected")).catch( (e: any) => console.log(`fug, ${e}`))

    //     this.connection!.on("ReceiveMessage", (user, message) => {
    //         console.log(`Received ${message}`)
    //     })
    // }

    sendMessage = (message: string) => {
        this.connection?.invoke("SendMessage", "root", message)
            .catch((e) => console.log(e.message))
    }
}