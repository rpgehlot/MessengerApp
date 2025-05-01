// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { nanoid } from 'npm:nanoid'
import { Redis } from 'npm:@upstash/redis';
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { Tables } from 'database';

type UserSessionCount = Record<string, number>;

interface CustomWebSocket extends WebSocket {
  userId ? : string;
  id ? : string;
}


async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const lockKey = `lock:${key}`; // Unique lock key
  const lockValue = nanoid(); // Unique value for the lock
  const lockTimeout = 10; // Lock expires in 10 seconds

  async function acquireLock(count : number) {
    // Attempt to acquire the lock
    const acquired = await redis.set(lockKey, lockValue, { nx: true, ex: lockTimeout });

    if (!acquired) {
      if (count === 10)
        return false;
      await Promise.resolve((resolve) => setTimeout(resolve, 100));
      return await acquireLock(count + 1);
    }
    else {
      return true;
    }
  }

  const lock = await acquireLock(0);
  if (lock) {
    try {
      // Execute the GET and SET operations
      return await fn();
    } finally {
      // Always release the lock, even if an error occurs
      await redis.del(lockKey);
    }
  }
  else {
    console.log('could not acquire lock after retries');
    return await Promise.reject();
  }
  
}


const serverId = nanoid();
console.log('server id is ',serverId);

const redis = new Redis({
    url: Deno.env.get('UPSTASH_REDIS_REST_URL'),
    token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN')
});

const env = Deno.env.get('NEXT_PUBLIC_ENV')
const supabaseUrl = env === 'development' ? Deno.env.get('NEXT_PUBLIC_SUPABASE_URL_DEV') : Deno.env.get('NEXT_PUBLIC_SUPABASE_URL_PROD');
const supabaseRoleKey = env === 'development' ? Deno.env.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_DEV') : Deno.env.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_PROD');


const supabase = createClient(
  supabaseUrl!,
  supabaseRoleKey!,
);


const REDIS_QUEUED_MESSAGE_PREFIX = Deno.env.get('REDIS_QUEUED_MESSAGE_PREFIX');
const deploymentVersion = Deno.env.get('DEPLOYMENT_VERSION') || 'v1.0.0';
// maps topic to a list of sockets.
const channels:Record<string, CustomWebSocket[]> = {};
const userSockets : Record<string, CustomWebSocket[]> = {};

const getOnlineUsers = async () => {
  const userSessionCounts = await redis.get<UserSessionCount>('userSessionCounts') || {};
  const s = new Set<string>([]);
  for (const user in userSessionCounts) {
    s.add(user);
  }
  return [...s];
};


const pubsub = redis.subscribe('userState');
pubsub.on('message', ( data : { channel : string; message : any} ) => {
  const { event, payload } = data.message;


  if(event === 'userjoined') {
      for (const user in userSockets) {
        if ( user === payload.userId)
            continue;

        const sockets = userSockets[user];
        for(const sock of sockets) {
            sock.send(JSON.stringify({
              event : 'userjoined',
              payload  : { userid : payload.userId} 
            }));
        }

        console.log('calling publish in ',serverId);
      }
  }
  else if(event === 'userleft') { 
    for (const user in userSockets) {
      const sockets = userSockets[user] || [];

      for(const sock of sockets){
        sock.send(JSON.stringify({ 
          event : 'userleft',
          payload  : { userid : payload.userId} 
        }));
      }
    }
  }
  else if (event === 'typing-start') {
    for (const user of payload.members) {
      console.log('user : ',user);
      userSockets[user] = userSockets[user] || [];
      if (user === payload.userId) continue;

      for(const sock of userSockets[user]) {
        sock.send(JSON.stringify({
          event : 'typing-start',
          payload
        }));
      }
    }
  }
  else if (event === 'typing-end') {
    for (const user of payload.members) {
      console.log('user : ',user);
      userSockets[user] = userSockets[user] || [];
      if (user === payload.userId) continue;

      for(const sock of userSockets[user]) {
        sock.send(JSON.stringify({
          event : 'typing-end',
          payload
        }));
      }
    }
  }
});

Deno.serve({
  async onListen() {

    console.log(`Server started : ${serverId}`);
    const resetKey = `reset:${deploymentVersion}`;
    const alreadyReset = await redis.get(resetKey);
  
    if (!alreadyReset) {
      console.log('reset key not set in serverid : ',serverId);
      await redis.del('userSessionCounts');
      await redis.set(resetKey, 'done', { ex: 86400 }); // Expire after 24 hours
      console.log(`Redis state reset for deployment ${deploymentVersion}`);
    }
  
  },  

}, (req) => {
  
  const upgrade = req.headers.get('upgrade') || ''

  if (upgrade.toLowerCase() != 'websocket') {
    return new Response("request isn't trying to upgrade to WebSocket.", { status: 400 });
  }

  
  const { socket : originalSocket, response } = Deno.upgradeWebSocket(req)

  const socket = originalSocket as CustomWebSocket;

  socket.onopen = () => {
    socket.id = nanoid();
  };

  socket.onmessage = async (e) => {
    try {

      const data = JSON.parse(e.data);
      
      if (data.event === 'subscribe' && socket.userId) {
        const { payload } = data as { payload : {topics  : string[]}};
        if (payload.topics?.length > 0) {
          payload.topics.forEach((topic) => {
            channels[topic] = channels[topic] || [];
            channels[topic].push(socket);
          });
        }
      }

      else if (data.event === 'authenticate')  {
        const { payload } = data;
        userSockets[payload.userId] = userSockets[payload.userId] || [];
        userSockets[payload.userId].push(socket);
        socket.userId = payload.userId;
        console.log('recvd authenticate in server id ',serverId);


        let userSessionCounts: UserSessionCount = {};
        await withLock('userSessionCounts', async () => {
          userSessionCounts = await redis.get<UserSessionCount>('userSessionCounts') || {};
          userSessionCounts[payload.userId] = userSessionCounts[payload.userId] || 0;
          userSessionCounts[payload.userId]++;
          await redis.set<UserSessionCount>('userSessionCounts', userSessionCounts);
        });
        

        if (userSessionCounts[payload.userId] === 1) {
            // broadcast to channel that xyz userid has joined.
          await redis.publish('userState',JSON.stringify({ event : 'userjoined', payload: {userId : payload.userId} }));              
        }


        const currentOnlineUsers = await getOnlineUsers();
        console.log('currentOnlineUsers : ',currentOnlineUsers);

        await redis.set('online-users', currentOnlineUsers);
        socket.send(JSON.stringify({
          event : 'auth-success',
          payload : currentOnlineUsers
        }));
      }
      else if (data.event === 'typing-start') {
        const { payload } = data;
        await redis.publish('userState',JSON.stringify({ event : 'typing-start', payload }));              
      } 
      else if (data.event === 'typing-end') {
        const { payload } = data;
        await redis.publish('userState',JSON.stringify({ event : 'typing-end', payload }));              
        
      } 
      else if (data.event === 'queued-messages') {
          
        const key = `${REDIS_QUEUED_MESSAGE_PREFIX}${socket.userId}`;
        const exists = await redis.exists(key);
        if (exists) {

          const queuedMessages:Tables<'messages'>[] = await redis.get(key) || [];
          
          console.log('queuedMessages : ',queuedMessages);
          const entries = queuedMessages.map(m => m.entry_id);
          
          const {error, data} = await supabase.from('messages').update({
            status : 'delievered'
          }).in('entry_id',entries);

          console.log(error, data);
          socket.send(JSON.stringify({
            event : 'queued-messages',
            payload : queuedMessages
          }));
          
          await redis.del(key);
        }

      }
    }catch(e){}
  }

  socket.onerror = (e) => {
    if (e instanceof Error)
      console.log('socket errored:', e.message);
  };

  socket.onclose = async () => {
    console.log('socket closed');
    if(!socket.userId)
      return;

    userSockets[socket.userId] = userSockets[socket.userId] || [];

    const socketIndex = userSockets[socket.userId].findIndex((s) => s.id === socket.id);
    if (socketIndex >= 0)
      userSockets[socket.userId].splice(socketIndex,1);

    for (const channel in channels) {
      const sockets = channels[channel] || [];

      const foundIndex = sockets.findIndex((s) => s.id === socket.id);
      if ( foundIndex >= 0 ) 
        sockets.splice(foundIndex,1);
    }

    let userSessionCounts: UserSessionCount = {};
    // store the count of 
    await withLock('userSessionCounts', async () => {
        
      if(!socket.userId)
        return;

      userSessionCounts = await redis.get<UserSessionCount>('userSessionCounts') || {};
      if (userSessionCounts[socket.userId] > 0)
        userSessionCounts[socket.userId]--;
      await redis.set<UserSessionCount>('userSessionCounts', userSessionCounts);

    });
    

    if (userSessionCounts[socket.userId] === 0) {
      await redis.publish('userState',JSON.stringify({ event : 'userleft', payload: {userId : socket.userId} }));              
      delete userSockets[socket.userId];
      await redis.set('online-users', getOnlineUsers());
    }
    // when a client closes the connecitom, get its userid from socket.userid a
    // and identify which all channels user was subscribed to and if usersockets[socket.userid] === 0
    
  };


  return response
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/onlineUsers' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
