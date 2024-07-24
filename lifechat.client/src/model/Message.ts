import User from "./User";
import Channel from "./Channel";

export default class Message {
    author!: User
    content: string = ""
    channelId!: Channel
}