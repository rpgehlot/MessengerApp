import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseServiceRole } from "@/utils/config";
import { redis } from '@/utils/redis';
import { REDIS_QUEUED_MESSAGE_PREFIX } from '@/lib/utils';

console.log('running onlinepresence 1...');

let joinListenerCount = 0;
const supabase = createClient(
    supabaseUrl,
    supabaseServiceRole
);

console.log('running onlinepresence 2...')
const channel = supabase.channel('online-users');

channel?.on('presence', { event: 'sync' }, () => {
    const currPresentState = channel?.presenceState()
    console.log('server inside presence: ', currPresentState);
});


channel?.on('presence', { event: 'join' }, async ({ newPresences}) => {
    console.log(`Join listner ${joinListenerCount} newPresences :  ${newPresences}`);
    for (const presence of newPresences) {
        if (presence.userId) {

            const key = `${REDIS_QUEUED_MESSAGE_PREFIX}${presence.userId}`;
            if (!await redis.exists(key))
                continue;

            const queuedMessages = await redis.get(key);
            
            supabase.channel(presence.userId).send({
                'type' : 'broadcast',
                event : 'shout',
                payload : {event : 'queuedMessages', data : queuedMessages }
            });

            console.log(key);
            await redis.del(key);
        }
    }
});

channel?.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
        joinListenerCount++;
        // console.log('server status: ', status);
        await channel.track({});
    }

    console.log('status : ',status)
});


export function getOnlineUsers() {

    const presenceState = channel.presenceState();
    
    const values = Object.values(presenceState)
      .flat()
      .map((state: any) => state.userId)
      .filter(Boolean); // Remove undefined/null values

    return new Set(values);
}