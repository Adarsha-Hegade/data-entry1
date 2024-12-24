import { supabase } from './supabase';

export async function checkIsFirstUser(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    return !data || data.length === 0;
  } catch (err) {
    console.error('Error checking first user:', err);
    throw err;
  }
}

export async function signUpAdmin(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin'
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }

    if (!data.user) {
      console.error('No user data returned from signup');
      throw new Error('Failed to create user');
    }

    // Log successful signup
    console.log('Admin signup successful:', {
      userId: data.user.id,
      email: data.user.email,
      metadata: data.user.user_metadata
    });

    return data;
  } catch (err) {
    console.error('Error signing up admin:', err);
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase signin error:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error signing in:', err);
    throw err;
  }
}

export async function verifyProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile verification error:', error);
      throw error;
    }

    if (!data) {
      console.error('No profile found for user:', userId);
      throw new Error('Profile not found');
    }

    return data;
  } catch (err) {
    console.error('Error verifying profile:', err);
    throw err;
  }
}