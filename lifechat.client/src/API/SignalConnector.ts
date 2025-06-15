import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import HttpClient from './HttpClient';
import store from '../store/store';

export class SignalConnector {

    private static connection: HubConnection | undefined = undefined
    private static eventReactionsToAdd = []

    static buildConnection() {
        const token = store.getState().userData.token
        if(token === null)
            return
        if(SignalConnector.connection)
            return;
        SignalConnector.connection = new HubConnectionBuilder()
        .withUrl(`${HttpClient.serverUrl}/hub`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            accessTokenFactory: () => {
                const token: string | undefined = store.getState().userData.token
                return token
            }
            })
        .build()


        SignalConnector.connection!.start().then(() => console.log("connected")).catch( (e: any) => console.log(e))

        if(SignalConnector.connection) {
            SignalConnector.connection.onreconnecting((e) => {
                console.error(e?.message)
                location.reload()
            })
            SignalConnector.eventReactionsToAdd.forEach(reaction => SignalConnector.connection.on(reaction.eventName, reaction.callback))
            SignalConnector.eventReactionsToAdd = []
        }

    }

    private static addCallbackToEvent(eventName: string, callback: (...args: any[]) => void) {
        if(SignalConnector.connection)
            SignalConnector.connection.on(eventName, callback)
        else {
            const newEventReaction = {
                eventName: eventName,
                callback: callback
            }
            SignalConnector.eventReactionsToAdd.push(newEventReaction)
        }
    }

    static onReceiveMessage(callback: () => void) {
        SignalConnector.addCallbackToEvent("ReceiveMessage", callback);
    }
    
    static onChangedChannelMembership(callback: (owningChatId: number) => void) {
        SignalConnector.addCallbackToEvent("ChangedChannelMembership", (owningChatId) => {
            callback(owningChatId)
        })
    }
}