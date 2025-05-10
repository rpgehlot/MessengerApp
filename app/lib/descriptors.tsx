import { User } from "@supabase/supabase-js";
import { Enums, Tables } from "./database-types";

export type Message = {
    content? : string;
    createdAt : string;
    messageId : number;
    status : Enums<'messagestatus'>;
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

export type ChatMember = {
    userId : string;
    name : string;
    avatarUrl? : string;
};

export type Chat = {
    chatId : number;
    chatName : string;
    isGroupChat :boolean;
    members: Array<ChatMember>;
    latestMessage? : Message;
    avatarUrl? : string;
    description? :string;
    unreadMessagesCount : number;
    messages : Message[];
    newChat? : {
        userId: string
    };
    visited? : boolean;
};


export interface ChatProps extends Chat {
    username? : string;
    onClick?: () => void;
    chatSelectionEnabled? : boolean;
    isOnline: boolean;
    user : User;
}

export interface MessageBlock extends Message {
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

export type TypingUserPayload = {
    channelId : number;
    userId : string;
};

export type ChatState = {
    visited :  boolean;
};

export enum ChatCategory {
    ALL = 'ALL',
    GROUP = 'GROUP',
    '1:1' = '1:1'
}


export interface ISidebarProps {
    chats : Chat[];
    selectedChat : Chat | null;
    handleChatSelection  : (chat: Chat) => void;
    user : User;
    chatState : {[chatId : number] : ChatState};
    onlineUsers : Set<string>;
}

export interface IMessagesWrapper {
    selectedChat : Chat | null;
    handleChatSelection  : (chat: Chat | null) => void;
    user : User;
    messages : Message[];
}

export interface IMessagesHeaderProps {
    handleChatSelection  : (chat: Chat | null) => void;
    selectedChat : Chat;
    setMessageSelectionEnabled : (v : boolean) => void;
}

export interface IMessagesFooterProps {
    handleChatSelection  : (chat: Chat | null) => void;
    selectedChat : Chat;
    setMessageSelectionEnabled : (v : boolean) => void;
    messageSelectionEnabled : boolean;
    selectedMessages : MessageBlock[];
    onNewMessageEntered : () => void;
}

export interface IProfileSectionProps {
    selectedChat : Chat;
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