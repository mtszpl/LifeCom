import Message from "./Message"


export default class Channel {
    id: number = -1
    chatId: number = -1
    name: string = ""
    messages: Message[] = []
}