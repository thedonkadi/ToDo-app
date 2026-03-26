import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Tasks({ user, setUser }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("deadline", { ascending: true });

    setTasks(data || []);
  };

  const addTask = async () => {
    if (!title) return;

    await supabase.from("tasks").insert([
      {
        title,
        deadline: deadline || null,
        user_id: user.id,
      },
    ]);

    setTitle("");
    setDeadline("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

        {/* QUOTE */}
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

        {/* CHATGPT STYLE INPUT */}
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

        {/* TASK LIST */}
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