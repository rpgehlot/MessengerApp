import { createSeedClient } from "@snaplet/seed";
import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Or .env, .env.development, etc.


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_PROD!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_PROD!
);

const deleteAllAuthUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    // console.error('Error fetching users:', error.message);
    return;
  }

  for (const user of data.users) {
    await supabase.auth.admin.deleteUser(user.id);
    // console.log(`Deleted user: ${user.email}`);
  }

  await supabase.from("users").delete({ count : 'exact'});
};

const seedAuthUser = async (user : {email : string, password : string, meta? : any}) => {

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata : {
        ...user.meta
      }
    });


    if (error) {
      // console.error('Error creating user:', error.message);
      return error
    }
    // else console.log('Created user:', data.user?.email);

    await supabase.from("users").insert({ id: data.user.id, email : user.email, username : user.meta.username});
    return data.user;
};


const main = async () => {
  const seed = await createSeedClient({ dryRun: true });

  // Optional: reset the database if needed
  await seed.$resetDatabase();
  const fakeUserData :any= [];
  const totalUsersCount = 11
  const totalChannelCount = 5;
  const totalGroupChannel = 1;
  const memberInEachGroup = 3;
  const public_users:any = [];
  // Generate 10 users with metadata

  deleteAllAuthUsers();

  for ( let i = 0 ; i < totalUsersCount ; i++ ) {
    const userData :any = {
      firstName : faker.person.firstName(),
      lastName  : faker.person.lastName(),
    };

    userData['username'] = faker.internet.username({
      firstName : userData.firstName,
      lastName : userData.lastName
    });
    
    const user = await seedAuthUser({
      password: userData['username'],
      email: faker.internet.email(),
      meta : {
        username : userData['username'],
        firstName : userData['firstName'],
        lastName : userData['lastName']
      }
    });

    // console.log({
    //   password: userData['username'],
    //   email: faker.internet.email(),
    //   meta : {
    //     username : userData['username'],
    //     firstName : userData['firstName'],
    //     lastName : userData['lastName']
    //   }
    // });
    
    public_users.push(user);
  }
  
  // // Now seed users_metadata with real user links
    // Seed users_metadata linked to each user
  await seed.users_metadata((x) =>
    x(public_users.length, (ctx) => {
      
      const index = Math.floor(Math.random() * 2);
      const index2 = Math.floor(Math.random() * 100);
      // console.log(public_users[ctx.index])
      return {
        user_id: public_users[ctx.index].id,
        first_name: public_users[ctx.index].user_metadata.firstName,
        last_name: public_users[ctx.index].user_metadata.lastName,
        username : public_users[ctx.index].user_metadata.username,
        avatar_url : `https://randomuser.me/api/portraits/${index > 0 ? 'women' : 'men'}/${index2}.jpg`,
      }
    })
  );

    const jj = await seed.channels((x) => 
    x(totalChannelCount, (ctx) => {
      if (ctx.index < totalChannelCount - 1 ) {
        // const randomUserOneIdx = Math.floor(Math.random() * 10);
        // const randomUserTwoIdx = randomUserOneIdx + 1 >= 10 ? 0 : randomUserOneIdx + 1;

        return {
          name : `single_channel_${ctx.index}`,
          is_group : false
        }
      }
      else {

        return {
          name : `Kailash Trip`,
          is_group : true
        }
      }
    })
  );

  let currUser = 0;
  let currChannel =  0;
  const jjj = await seed.channel_user_mapping((x) => 
    x((2 * (totalChannelCount - totalGroupChannel) + (memberInEachGroup * totalGroupChannel)), (ctx) => {

      currUser++

      if (ctx.index <= 2 * (totalChannelCount - totalGroupChannel)) {
        if (ctx.index % 2 == 0)
          currChannel++;
        return {
          user_id : public_users[currUser - 1].id,
          channel_id : jj.channels[currChannel - 1].id
        }
      }
      else {
        return {
          user_id : public_users[currUser - 1].id,
          channel_id : jj.channels[currChannel - 1].id
        }
      }
    })
  );


  const zz = await seed.last_sequence((x) => 
    x(totalChannelCount,(ctx) => {
      return {
        channel_id : jj.channels[ctx.index].id,
        last_sequence : 10
      }
    })
  );

  
  const yy = await seed.public_messages((x) => 
    x(totalChannelCount * 10, (ctx) => {

      const index = Math.floor(Math.random() * totalUsersCount);
      const channelId = jj.channels[Math.floor(ctx.index / 10)].id
      const entries = jjj.channel_user_mapping.filter((entry) => {
        return (entry.channel_id === channelId);
      });

      const randomIdx = Math.floor(Math.random() * entries.length);

      return  {
        channel_id : channelId,
        message_id : ctx.index % 10,
        sender_id : entries[randomIdx].user_id,
        content : faker.lorem.sentence({ min: 3, max: 12 }),
        created_at : faker.date.past()
      }
      
    })
  );

  // console.log("Database seeded successfully!");
  process.exit();
};

main();
