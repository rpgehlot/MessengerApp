import { User } from "@supabase/supabase-js";


export interface ChatProps {
    chatId : number;
    chatName : string;
    isGroupChat :boolean;
    members: Array<{
        userId : string;
        name : string;
        avatarUrl? : string;
    }>;
    isOnline : boolean;
    latestMessage? : {
        content : string;
        createdAt : string;
        senderId : string;
        read:boolean;
        messageId : number;
    }
    avatarUrl? : string;
    description? :string;
    username? : string;
    unreadMessagesCount : number;
    onClick?: () => void;
    messages? : MessageBlock[];
    chatSelectionEnabled? : boolean;
    user : User;
    newChat? : {
        userId: string
    }
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

export type Message = {
    content? : string;
    createdAt : string;
    messageId : number;
    read : boolean;
    sender : {
        avatarUrl : string;
        email : string;
        id : string;
        name : string;
    };
    media? : {
        type : 'audio' | 'video' | 'image',
        url : string;
    };
};



export type ChatState = {
    visited :  boolean;
    latestMessage?  : {
        content : string;
        createdAt : string;
        senderId : string;
        read:boolean;
        messageId : number;
    };
    messages : Message[];
};

export enum ChatCategory {
    ALL = 'ALL',
    GROUP = 'GROUP',
    '1:1' = '1:1'
}


export interface ISidebarProps {
    chats : ChatProps[];
    selectedChat : ChatProps | null;
    handleChatSelection  : (chat: ChatProps) => void;
    user : User;
    chatState : {[chatId : number] : ChatState};
    onlineUsers : Set<string>;
}

export interface IMessagesWrapper {
    selectedChat : ChatProps | null;
    handleChatSelection  : (chat: ChatProps | null) => void;
    user : User;
    messages : Message[];
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
    setChatMenuOpenState : (x : boolean) => void;
}

export interface ICreateNewGroupChatProps {
    children? : React.ReactNode;
    setChatMenuOpenState : (x : boolean) => void;
    user : User;
}

export interface IMuteNotificationProps {
    children? : React.ReactNode
}

export interface IUsersSearch{
    name : string;
    avatarUrl : string;
    userId : string;
    username : string;
}