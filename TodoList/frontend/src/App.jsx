import { useEffect, useRef, useState } from "react";
import "./styles/App.scss";
import TaskCard from "./components/TaskCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import AnimatedTaskCard from "./components/AnimatedTaskCard";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    if (dragIndex == null || dragIndex == dropIndex) return;

    const reordered = [...tasks];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setTasks(reordered);
    setDragIndex(null);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask, due_date: dueDate, category }),
    });

    setNewTask("");
    setDueDate("");
    fetchTasks();
  };

  const handleToggleComplete = async (id) => {
    await fetch(`http://localhost:8000/tasks/${id}`, { method: "PATCH" });
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await fetch(`http://localhost:8000/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filter == "active"
        ? !task.completed
        : filter == "completed"
        ? task.completed
        : true;

    const matchesCategory = categoryFilter
      ? task.category == categoryFilter
      : true;
    return matchesStatus && matchesCategory;
  });

  return (
    // <>
    <div className="container">
      <h1>Todo Tasks</h1>

      <div className="task-input">
        <input
          type="text"
          placeholder="Add a task..."
          aria-label="New task input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Task category"
        >
          <option value="">Select category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Design">Design</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Design">Design</option>
        </select>
        <button
          className="clear-btn"
          onClick={async () => {
            const completed = tasks.filter((t) => t.completed);
            await Promise.all(
              completed.map((t) =>
                fetch(`http://localhost:8000/tasks/${t.id}`, {
                  method: "DELETE",
                })
              )
            );
            fetchTasks();
          }}
        >
          Clear Completed
        </button>

        <button onClick={handleAddTask}>+</button>
      </div>

      <div className="filter-bar">
        <button
          onClick={() => setFilter("all")}
          className={filter == "all" ? "active" : ""}
          aria-pressed={filter == "all"}
          aria-label="Show all tasks"
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filter == "active" ? "active" : ""}
          aria-pressed={filter == "active"}
          aria-label="Show active tasks"
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter == "completed" ? "active" : ""}
          aria-pressed={filter == "completed"}
          aria-label="Show completed tasks"
        >
          Completed
        </button>
      </div>

      {loading && <div className="spinner">Loading tasks.. </div>}
      {error && <div className="error">Oops! {error}</div>}

      {/* <TransitionGroup> */}
      {/* <div
        className="task-card"
        tabIndex="0"
        role="group"
        aria-label={`Task: ${task.title}`}
      > */}
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="task-card"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, index)}
          tabIndex="0"
          role="group"
          aria-label={`Task: ${task.title}`}
        >
          <TaskCard
            task={task}
            onToggle={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        </div>
      ))}
      {/* </div> */}
      {/* </TransitionGroup> */}
    </div>
    // </>
  );
}
