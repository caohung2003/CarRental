export interface Rating {
    id: number;
    stars: number;
    comment: string;
    senderId: number;
    senderFirstName: string;
    senderLastName: string;
    senderAvatar: string;
    receiverId: number;
    receiverFirstName: string;
    receiverLastName: string;
    receiverAvatar: string;
    dateTime: string;
    isRenterFeedback: boolean;
    canFixed?: boolean,
    bookingId?: number
}
