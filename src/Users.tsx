import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users.map((u) => (
        <div key={u.id} className="user-item">
          {u.email}
        </div>
      ))}
    </div>
  );
}