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

    }

    onReceiveMessage(callback: () => void) {
        if(this.connection) {
            this.connection.on("ReceiveMessage", (author, content) => {
                callback()
            })
        }
    }
}