import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import HttpClient from './HttpClient';

export class SignalConnector {

    private static connection: HubConnection | undefined = undefined

    static buildConnection() {
        const token = localStorage.getItem("token")
        if(token === null)
            return
        console.log("connecting")
        SignalConnector.connection = new HubConnectionBuilder()
        .withUrl(`${HttpClient.serverUrl}/hub`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            accessTokenFactory: () => {
                const token = localStorage.getItem("token")
                return token
            }
            })
        .build()


        SignalConnector.connection!.start().then(() => console.log("connected")).catch( (e: any) => console.log(`fug, ${e}`))

        if(SignalConnector.connection !== undefined) {
            SignalConnector.connection.onreconnecting((e) => {
                console.error(e?.message)
                alert("Lost connection to server, the site will now refresh")
                location.reload()
            })
        }

    }

    static onReceiveMessage(callback: () => void) {
        console.log("on message")
        if(SignalConnector.connection) {
            SignalConnector.connection.on("ReceiveMessage", (author, content) => {
                callback()
            })
        }
    }

    static addToChat(){
        if(SignalConnector.connection) {
            SignalConnector.connection.send("AddUserToChat")
        }
    }
    
    static onAddedToChat() {
        SignalConnector.connection?.on("AddedToChannel", (channelName) => {
            console.log(`added to channel ${channelName}`)
        })
    }
}