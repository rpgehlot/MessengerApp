import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   'https://vxvgrflvqvvmbikszhbd.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dmdyZmx2cXZ2bWJpa3N6aGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc5NTg3OCwiZXhwIjoyMDYwMzcxODc4fQ.DHbgxutGmRD8hq_393QkdDxguki306p_wFtkKpgj0oI' // Must use service role!
// );

const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU' // Must use service role!
);

const seedAuthUsers = async () => {
  const users = [
    {
      email: 'alice@example.com',
      password: 'password123',
    },
    {
      email: 'bob@example.com',
      password: 'securepass456',
    },
  ];

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    await supabase.from("users").insert({ id: data.user?.id });

    if (error) console.error('Error creating user:', error.message);
    else console.log('Created user:', data.user?.email);
  }
};

seedAuthUsers();
