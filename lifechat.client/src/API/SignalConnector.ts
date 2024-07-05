import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export class SignalConnector {

    connection: HubConnection | undefined = undefined

    constructor() {
        this.connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7078/hub", {skipNegotiation: true, transport: HttpTransportType.WebSockets})
        .build()

        this.connection!.start().then(() => console.log("connected")).catch( (e: any) => console.log(`fug, ${e}`))

        this.connection!.on("ReceiveMessage", (user, message) => {
            console.log(`Received ${message}}`)
        })
    }

    sendMessage = (message: string) => {
        this.connection?.invoke("SendMessage", "root", message)
            .catch((e) => console.log(e.message))
    }
}