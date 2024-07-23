import User from "./User";
import Channel from "./Channel";

export default class Message {
    author: User | null = null
    content: string = ""
    channelId: Channel | null = null
}