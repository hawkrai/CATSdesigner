export class MessageResponse {
    InboxMessages: Message[];
    OutboxMessages: Message[];
}

export class DisplayMessage {
    DisplayMessage: Message[];
}

export class Message {
    AthorId: string;
    AthorName: string;
    AttachmentsCount: number;
    Date: string;
    Id: number;
    IsRead: boolean;
    PreviewText: string;
    Recipients: string[];
    Subject: string;
}

export class Recipients {
    text: string;
    value: string;
}
