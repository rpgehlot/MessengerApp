const RITUPARN_AVATAR = 'https://randomuser.me/api/portraits/men/44.jpg';
const RITUPARN_USERID = '628c9c75-c638-4fd6-8c39-515328e5a38b';

const LUCKY_AVATAR = 'https://randomuser.me/api/portraits/women/65.jpg';
const ALICE_AVATAR = 'https://randomuser.me/api/portraits/women/10.jpg';
const LUKE_AVATAR = 'https://randomuser.me/api/portraits/men/45.jpg';

const images= [
    {"id":"0","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/yC-Yzbqy7PY","download_url":"https://picsum.photos/id/0/5000/3333"},
    {"id":"1","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/LNRyGwIJr5c","download_url":"https://picsum.photos/id/1/5000/3333"},
    {"id":"2","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/N7XodRrbzS0","download_url":"https://picsum.photos/id/2/5000/3333"},
    {"id":"3","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/Dl6jeyfihLk","download_url":"https://picsum.photos/id/3/5000/3333"},
    {"id":"4","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/y83Je1OC6Wc","download_url":"https://picsum.photos/id/4/5000/3333"},
    {"id":"5","author":"Alejandro Escamilla","width":5000,"height":3334,"url":"https://unsplash.com/photos/LF8gK8-HGSg","download_url":"https://picsum.photos/id/5/5000/3334"},
    {"id":"6","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/tAKXap853rY","download_url":"https://picsum.photos/id/6/5000/3333"},
    {"id":"7","author":"Alejandro Escamilla","width":4728,"height":3168,"url":"https://unsplash.com/photos/BbQLHCpVUqA","download_url":"https://picsum.photos/id/7/4728/3168"},
    {"id":"8","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/xII7efH1G6o","download_url":"https://picsum.photos/id/8/5000/3333"},
    {"id":"9","author":"Alejandro Escamilla","width":5000,"height":3269,"url":"https://unsplash.com/photos/ABDTiLqDhJA","download_url":"https://picsum.photos/id/9/5000/3269"},
    {"id":"10","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/6J--NXulQCs","download_url":"https://picsum.photos/id/10/2500/1667"},
    {"id":"11","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/Cm7oKel-X2Q","download_url":"https://picsum.photos/id/11/2500/1667"},
    {"id":"12","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/I_9ILwtsl_k","download_url":"https://picsum.photos/id/12/2500/1667"},
    {"id":"13","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/3MtiSMdnoCo","download_url":"https://picsum.photos/id/13/2500/1667"},
    {"id":"14","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/IQ1kOQTJrOQ","download_url":"https://picsum.photos/id/14/2500/1667"},
    {"id":"15","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/NYDo21ssGao","download_url":"https://picsum.photos/id/15/2500/1667"},
    {"id":"16","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/gkT4FfgHO5o","download_url":"https://picsum.photos/id/16/2500/1667"},
    {"id":"17","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/Ven2CV8IJ5A","download_url":"https://picsum.photos/id/17/2500/1667"},
    {"id":"18","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/Ps2n0rShqaM","download_url":"https://picsum.photos/id/18/2500/1667"},
    {"id":"19","author":"Paul Jarvis","width":2500,"height":1667,"url":"https://unsplash.com/photos/P7Lh0usGcuk","download_url":"https://picsum.photos/id/19/2500/1667"},
    {"id":"20","author":"Aleks Dorohovich","width":3670,"height":2462,"url":"https://unsplash.com/photos/nJdwUHmaY8A","download_url":"https://picsum.photos/id/20/3670/2462"},
    {"id":"21","author":"Alejandro Escamilla","width":3008,"height":2008,"url":"https://unsplash.com/photos/jVb0mSn0LbE","download_url":"https://picsum.photos/id/21/3008/2008"},
    {"id":"22","author":"Alejandro Escamilla","width":4434,"height":3729,"url":"https://unsplash.com/photos/du_OrQAA4r0","download_url":"https://picsum.photos/id/22/4434/3729"},
    {"id":"23","author":"Alejandro Escamilla","width":3887,"height":4899,"url":"https://unsplash.com/photos/8yqds_91OLw","download_url":"https://picsum.photos/id/23/3887/4899"},
    {"id":"24","author":"Alejandro Escamilla","width":4855,"height":1803,"url":"https://unsplash.com/photos/cZhUxIQjILg","download_url":"https://picsum.photos/id/24/4855/1803"},
    {"id":"25","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"https://unsplash.com/photos/Iuq0EL4EINY","download_url":"https://picsum.photos/id/25/5000/3333"},
    {"id":"26","author":"Vadim Sherbakov","width":4209,"height":2769,"url":"https://unsplash.com/photos/tCICLJ5ktBE","download_url":"https://picsum.photos/id/26/4209/2769"},
    {"id":"27","author":"Yoni Kaplan-Nadel","width":3264,"height":1836,"url":"https://unsplash.com/photos/iJnZwLBOB1I","download_url":"https://picsum.photos/id/27/3264/1836"},
    {"id":"28","author":"Jerry Adney","width":4928,"height":3264,"url":"https://unsplash.com/photos/_WiFMBRT7Aw","download_url":"https://picsum.photos/id/28/4928/3264"},
    {"id":"29","author":"Go Wild","width":4000,"height":2670,"url":"https://unsplash.com/photos/V0yAek6BgGk","download_url":"https://picsum.photos/id/29/4000/2670"}
];

export const chats = [
    {
        chatId : 1,
        chatName : 'John Doe',
        isGroupChat : false,
        latestMessage : {
            content : 'yeah man! seems like you are caught up in a lot of stuff',
            createdAt : '2025-04-07T14:14:13.832Z'
        },
        isOnline : true,
        avatarUrl : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        unreadMessagesCount : 1,
        messages : [
            {
                messageId : 0,
                sender : {
                    name: 'John Doe',
                    id : 0,
                    email : 'john.doe@gmail.com',
                    avatarUrl : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                },
                createdAt : '2025-04-07T14:14:13.832Z',
                content : 'Hi Rituparn',
                loggedInUserId : RITUPARN_USERID,
                read : true
            },
            {
                messageId : 1,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:13.832Z',
                content : 'Hi John',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 3,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'How are you ?',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 4,
                sender : {
                    name: 'John Doe',
                    id : 0,
                    email : 'john.doe@gmail.com',
                    avatarUrl : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                },
                createdAt : '2025-04-07T14:19:13.832Z',
                content : 'Long time no see!!',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 5,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'yeah man! seems like you are caught up in a lot of stuff 😆',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 6,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                media : {
                    url : images[17].download_url,
                    type : 'image'
                },
                loggedInUserId : RITUPARN_USERID,
                read : true
            },
            {
                messageId : 7,
                sender : {
                    name: 'John Doe',
                    id : 0,
                    email : 'john.doe@gmail.com',
                    avatarUrl : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                },
                createdAt : '2025-04-07T14:14:13.832Z',
                media : {
                    url : images[27].download_url,
                    type : 'image'
                },
                loggedInUserId : RITUPARN_USERID,
                read : false
            },
        ]
    },
    {
        chatId : 2,
        chatName : 'Lucky ',
        isGroupChat : false,
        isOnline : false,
        latestMessage : {
            content : 'I am currently in NY. what about you ??',
            createdAt : '2025-04-07T14:14:13.832Z'
        },
        avatarUrl : 'https://randomuser.me/api/portraits/women/65.jpg',
        unreadMessagesCount : 0,
        messages : [
            {
                messageId : 0,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-08T14:15:13.832Z',
                content : 'Hi Lucky',
                loggedInUserId : RITUPARN_USERID,
                read : true
            },
            {
                messageId : 1,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:13.832Z',
                content : 'wassup ??',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 3,
                sender : {
                    name: 'Lucky',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'How are you ?',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 4,
                sender : {
                    name: 'Lucky',
                    id : 0,
                    email : 'john.doe@gmail.com',
                    avatarUrl : LUCKY_AVATAR
                },
                createdAt : '2025-04-07T14:19:13.832Z',
                content : 'Long time no see!!',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 5,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'I am currently in NY. what about you ??',
                loggedInUserId : RITUPARN_USERID,
                read : false

            },
        ]
        
    },
    {
        chatId : 3,
        chatName : 'Alice',
        isGroupChat : false,
        isOnline : true,
        latestMessage : {
            content : 'Good to hear that !! lets catch up then',
            createdAt : '2025-04-07T14:14:13.832Z'
        },
        avatarUrl : ALICE_AVATAR,
        unreadMessagesCount : 0,
        messages : [
            {
                messageId : 0,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-08T14:15:13.832Z',
                content : 'Hi Alice',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 1,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:13.832Z',
                content : 'are you in wonderland ? 🤣',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 2,
                sender : {
                    name: 'Alice',
                    id : 3,
                    email : 'alice@gmail.com',
                    avatarUrl : LUCKY_AVATAR
                },
                createdAt : '2025-04-07T19:19:13.832Z',
                content : 'No, i am on earth only',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
            {
                messageId : 5,
                sender : {
                    name: 'Rituparn Gehlot',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Good to hear that !! lets catch up then ',
                loggedInUserId : RITUPARN_USERID,
                read : true

            },
        ]
    },
    {
        chatId : 4,
        chatName : 'Luke Jon',
        isGroupChat : false,
        isOnline : true,
        latestMessage : {
            content : 'Wanna join in for party time at my place??',
            createdAt : '2025-04-07T14:14:13.832Z'
        },
        avatarUrl : LUKE_AVATAR,
        unreadMessagesCount : 1,
        messages : [
            {
                messageId : 0,
                sender : {
                    name: 'Luke',
                    id : 4,
                    email : 'luke@gmail.com',
                    avatarUrl : LUKE_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Wanna join in for party time at my place??',
                loggedInUserId : RITUPARN_USERID,
                read : false
            },
        ]
    },
    {
        chatId : 5,
        chatName : 'Jon Farewell party',
        isGroupChat  : true,
        latestMessage : {
            content : 'Throw a party jon :)',
            createdAt : '2025-04-07T14:14:13.832Z'
        },
        avatarUrl : 'https://randomuser.me/api/portraits/men/21.jpg',
        unreadMessagesCount : 2,
        messages : [
            {
                messageId : 0,
                sender : {
                    name: 'Luke',
                    id : 4,
                    email : 'luke@gmail.com',
                    avatarUrl : LUKE_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Hi Jon uncle, congrats on farewell :)',
                loggedInUserId : RITUPARN_USERID
            },
            {
                messageId : 1,
                sender : {
                    name: 'George',
                    id : 6,
                    email : 'george@gmail.com',
                    avatarUrl : 'https://randomuser.me/api/portraits/men/25.jpg'
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Hi Jon, congrats man :)',
                loggedInUserId : RITUPARN_USERID
            },
            {
                messageId : 2,
                sender : {
                    name: 'Logan su',
                    id : 7,
                    email : 'george@gmail.com',
                    avatarUrl : 'https://randomuser.me/api/portraits/men/29.jpg'
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Hi Jon, congrats man :)',
                loggedInUserId : RITUPARN_USERID
            },
            {
                messageId : 3,
                sender : {
                    name: 'Miley cyrus',
                    id : 6,
                    email : 'george@gmail.com',
                    avatarUrl : 'https://randomuser.me/api/portraits/men/40.jpg'
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Hi Jon, congrats man :)',
                loggedInUserId : RITUPARN_USERID
            },
            {
                messageId : 4,
                sender : {
                    name: 'Rituparn',
                    id : RITUPARN_USERID,
                    email : 'rpgehlot1991@gmail.com',
                    avatarUrl : RITUPARN_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Hi Jon, congrats man :)',
                loggedInUserId : RITUPARN_USERID
            },
            {
                messageId : 4,
                sender : {
                    name: 'John Doe',
                    id : 0,
                    email : 'john.doe@gmail.com',
                    avatarUrl : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                },
                createdAt : '2025-04-07T14:14:13.832Z',
                media : {
                    url : images[16].download_url,
                    type : 'image'
                },
                loggedInUserId : RITUPARN_USERID,
            },
            {
                messageId : 5,
                sender : {
                    name: 'Lucky',
                    id : 1,
                    email : 'LUCKY@gmail.com',
                    avatarUrl : LUCKY_AVATAR
                },
                createdAt : '2025-04-07T14:15:19.832Z',
                content : 'Throw a party jon :)',
                loggedInUserId : RITUPARN_USERID
            },
            
        ]
    },
   

];

export const randomNewChats = [
    {
        avatarUrl : 'https://randomuser.me/api/portraits/men/49.jpg',
        name : 'Arthur Lee'
    },
    {
        avatarUrl : 'https://randomuser.me/api/portraits/men/42.jpg',
        name : 'James Bond'
    },
    {
        avatarUrl : 'https://randomuser.me/api/portraits/women/49.jpg',
        name : 'Anna Jose'
    },
    {
        avatarUrl : 'https://randomuser.me/api/portraits/men/23.jpg',
        name : 'Ramesh Mittal'
    },
    {
        avatarUrl : 'https://randomuser.me/api/portraits/men/67.jpg',
        name : 'Su yoan'
    },
]

// 'Block', 'Close chat','Clear chat',
export const messageMenuItems = [  'Delete chat'];
export const messageMenuItemsForGroupChat = ['Group info', 'Select messages' , 'Mute notifications', 'Close chat','Clear chat', 'Exit Group'];


export const loggedInUser = {
    "id": "628c9c75-c638-4fd6-8c39-515328e5a38b",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "rpgehlot1991@gmail.com",
    "email_confirmed_at": "2025-04-04T11:30:06.055818Z",
    "phone": "",
    "confirmation_sent_at": "2025-04-04T11:29:09.985618Z",
    "confirmed_at": "2025-04-04T11:30:06.055818Z",
    "last_sign_in_at": "2025-04-15T11:13:52.574224Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {
        "email": "rpgehlot1991@gmail.com",
        "email_verified": true,
        "phone_verified": false,
        "sub": "628c9c75-c638-4fd6-8c39-515328e5a38b"
    },
    "identities": [
        {
            "identity_id": "9b2d7786-85e6-428a-8aa9-b7ee2eaeee5e",
            "id": "628c9c75-c638-4fd6-8c39-515328e5a38b",
            "user_id": "628c9c75-c638-4fd6-8c39-515328e5a38b",
            "identity_data": {
                "email": "rpgehlot1991@gmail.com",
                "email_verified": true,
                "phone_verified": false,
                "sub": "628c9c75-c638-4fd6-8c39-515328e5a38b"
            },
            "provider": "email",
            "last_sign_in_at": "2025-04-04T11:29:09.951431Z",
            "created_at": "2025-04-04T11:29:09.951494Z",
            "updated_at": "2025-04-04T11:29:09.951494Z",
            "email": "rpgehlot1991@gmail.com"
        }
    ],
    "created_at": "2025-04-04T11:29:09.905117Z",
    "updated_at": "2025-04-15T11:13:52.576852Z",
    "is_anonymous": false
};