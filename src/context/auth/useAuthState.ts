
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { Session } from "@supabase/supabase-js";

export const useAuthState = (
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  useEffect(() => {
    console.log("Setting up auth state listener");
    setIsLoading(true);
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid auth deadlocks
          setTimeout(async () => {
            try {
              // Get user profile info including role from the profiles table
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username, avatar_url, role')
                .eq('id', session.user.id)
                .single();
              
              if (profileData) {
                console.log("Profile data fetched successfully:", profileData);
                const userData: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  username: profileData.username || session.user.email?.split('@')[0] || 'User',
                  role: profileData.role as "user" | "admin",
                  avatar_url: profileData.avatar_url
                };
                
                setUser(userData);
              } else {
                console.error("Error fetching profile data:", profileError);
                setUser(null);
              }
            } catch (error) {
              console.error("Error in auth state change callback:", error);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // We'll fetch the user data in a deferred way to avoid auth deadlocks
        setTimeout(async () => {
          try {
            // Get user profile info including role from the profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username, avatar_url, role')
              .eq('id', session.user.id)
              .single();

            if (profileData) {
              console.log("Profile data fetched during init:", profileData);
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                username: profileData.username || session.user.email?.split('@')[0] || 'User',
                role: profileData.role as "user" | "admin",
                avatar_url: profileData.avatar_url
              };
              
              setUser(userData);
            } else {
              console.error("Error fetching profile data during init:", profileError);
              setUser(null);
            }
          } catch (error) {
            console.error("Error in auth state init:", error);
            setUser(null);
          }
          setIsLoading(false);
        }, 0);
      } else {
        console.log("No session found during init");
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsLoading]);
};
