const getSupabaseKey = () => {
    switch (process.env.NEXT_PUBLIC_ENV) {
      case 'production':
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD!;
      default:
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV!;
    }
};
  
export const supabaseKey = getSupabaseKey();
  

const getSupabaseUrl = () => {
    switch (process.env.NEXT_PUBLIC_ENV) {
      case 'production':
        return process.env.NEXT_PUBLIC_SUPABASE_URL_PROD!;
      default:
        return process.env.NEXT_PUBLIC_SUPABASE_URL_DEV!;
    }
};
  
export const supabaseUrl = getSupabaseUrl();
  

const getSupabaseServiceRole = () => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'production':
      return process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_PROD!;
    default:
      return process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_DEV!;
  }
};

export const supabaseServiceRole = getSupabaseServiceRole();