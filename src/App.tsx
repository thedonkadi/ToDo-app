import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import Notes from "./Notes";

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!user) return <Auth setUser={setUser} />;

  return <Notes user={user} setUser={setUser} />;
}