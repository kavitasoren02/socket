export type JoinedUser = {
 currentUser: string;
 selectedUser: string;   
}

export type MessageData = {
    message: string,
    timestamp: string;
    sendBy: string;
    sendTo: string;
}