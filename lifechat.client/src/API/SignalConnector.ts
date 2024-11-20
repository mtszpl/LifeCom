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

        if(this.connection !== undefined) {
            this.connection.onreconnecting((e) => {
                console.error(e?.message)
                alert("Lost connection to server, the site will now refresh")
                location.reload()
            })
        }

    }

    onReceiveMessage(callback: () => void) {
        if(this.connection) {
            this.connection.on("ReceiveMessage", (author, content) => {
                callback()
            })
        }
    }

    onAddedToChat() {
        this.connection?.on("AddedToChannel", (channelName) => {
            console.log(`added to channel ${channelName}`)
        })
    }
}