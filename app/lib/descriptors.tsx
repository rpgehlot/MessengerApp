export interface UserData {
    id : string;
    email? : string;
}

export interface ChatProps {
    chatId : number;
    chatName : string;
    isGroupChat :boolean;
    isOnline : boolean;
    latestMessage : {
        content : string;
        createdAt : string;
    }
    avatarUrl : string;
    unreadMessagesCount : number;
    onClick?: () => void;
    messages? : MessageBlock[];
    chatSelectionEnabled? : boolean
}

export interface MessageBlock {
    messageId : number;
    sender :  {
        name : string;
        id : string;
        email : string;
        avatarUrl : string;
    };
    createdAt : string;
    content? : string;
    media? : {
        type : 'audio' | 'video' | 'image',
        url : string;
    };
    read : boolean;
    loggedInUserId : string;
    displayName : boolean;
    messageSelectionEnabled : boolean;
    onMessageSelectionChange : (a : MessageBlock, b : boolean) => void;
}

export interface IsTypingMessage {
    sender :  {
        name : string;
        id : string;
        email : string;
        avatarUrl : string;
    };
}

export enum ChatCategory {
    ALL = 'ALL',
    GROUP = 'GROUP',
    '1:1' = '1:1'
}


export interface ISidebarProps {
    chats : ChatProps[];
    selectedChat : ChatProps | null;
    handleChatSelection  : (chat: ChatProps) => void;
}

export interface IMessagesWrapper {
    selectedChat : ChatProps | null;
    handleChatSelection  : (chat: ChatProps | null) => void;
    user : UserData;
}

export interface IMessagesHeaderProps {
    handleChatSelection  : (chat: ChatProps | null) => void;
    selectedChat : ChatProps;
    setMessageSelectionEnabled : (v : boolean) => void;
}

export interface IMessagesFooterProps {
    handleChatSelection  : (chat: ChatProps | null) => void;
    selectedChat : ChatProps;
    setMessageSelectionEnabled : (v : boolean) => void;
    messageSelectionEnabled : boolean;
    selectedMessages : MessageBlock[];
}

export interface IProfileSectionProps {
    selectedChat : ChatProps;
    children? : React.ReactNode
}

export interface ICreateNewChatProps {
    children? : React.ReactNode
}

export interface ICreateNewGroupChatProps {
    children? : React.ReactNode
}

export interface IMuteNotificationProps {
    children? : React.ReactNode
}