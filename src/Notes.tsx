import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Tasks({ user, setUser }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id) // ✅ SECURITY FIX
      .order("deadline", { ascending: true });

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }

    setTasks(data || []);
  };

  const addTask = async () => {
    if (!title || !user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          deadline: deadline || null,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      return;
    }

    // ✅ Optimistic update (no refetch)
    setTasks((prev) => [...prev, data]);

    setTitle("");
    setDeadline("");
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    // ✅ Optimistic update
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, [user]); // ✅ important

  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="logo">
          <h2>To Do</h2>
          <p>Stay consistent</p>
        </div>

        <div className="stats">
          <div className="stat-box">
            <span>{tasks.length}</span>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="quote-box">
          <p>"Small steps every day build unstoppable momentum."</p>
        </div>

        <div className="divider" />

        <div className="sidebar-bottom">
          <button
            className="logout"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            Logout
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="main">

        <h1>My Tasks</h1>

        <div className="chat-input">

          <input
            type="text"
            placeholder="Add a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button onClick={addTask}>➤</button>

        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">

              <div className="task-left">
                <div className="task-title">{task.title}</div>

                {task.deadline && (
                  <div className="task-deadline">
                    ⏰ {new Date(task.deadline).toLocaleString()}
                  </div>
                )}
              </div>

              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}