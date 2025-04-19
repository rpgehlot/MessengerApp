import { createSeedClient } from "@snaplet/seed";
import { faker } from '@faker-js/faker';
const main = async () => {
  const seed = await createSeedClient({ dryRun: true });

  // Optional: reset the database if needed
  // await seed.$resetDatabase();
  const fakeUserData :any= [];
  const totalUsersCount = 11
  const totalChannelCount = 5;
  const totalGroupChannel = 1;
  const memberInEachGroup = 3;
  // Generate 10 users with metadata
  const users = await seed.public_users((x) =>
    x(totalUsersCount, () => {

      const userData :any = {
        firstName : faker.person.firstName(),
        lastName  : faker.person.lastName(),
      };

      userData['username'] = faker.internet.username({
        firstName : userData.firstName,
        lastName : userData.lastName
      });
      
      
      fakeUserData.push(userData);

      return {
        username: userData.username,
        password: faker.internet.password(),
        email: faker.internet.email(),
        created_at: faker.date.past(),
      }
    })
  );

  // // Now seed users_metadata with real user links
    // Seed users_metadata linked to each user
  await seed.users_metadata((x) =>
    x(users.public_users.length, (ctx) => {
      
      const index = Math.floor(Math.random() * 2);
      const index2 = Math.floor(Math.random() * 100);

      return {
        user_id: users.public_users[ctx.index].id,
        first_name: fakeUserData[ctx.index].firstName,
        last_name: fakeUserData[ctx.index].lastName,
        // avatar_url: faker.image.avatar(),
        avatar_url : `https://randomuser.me/api/portraits/${index > 0 ? 'women' : 'men'}/${index2}.jpg`,
        is_online : true
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

  let currUser = users.public_users[0].id || 0;
  let currChannel = jj.channels[0].id || 0;
  const jjj = await seed.channel_user_mapping((x) => 
    x((2 * (totalChannelCount - totalGroupChannel) + (memberInEachGroup * totalGroupChannel)), (ctx) => {

      currUser++

      if (ctx.index <= 2 * (totalChannelCount - totalGroupChannel)) {
        if (ctx.index % 2 == 0)
          currChannel++;
        return {
          user_id : currUser-1,
          channel_id : currChannel - 1
        }
      }
      else {
        return {
          user_id : (currUser - 1),
          channel_id : currChannel - 1
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
