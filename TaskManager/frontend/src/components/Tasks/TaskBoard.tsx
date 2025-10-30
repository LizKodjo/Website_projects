import { useEffect, useState, type FC } from "react";
import { useTask } from "../../contexts/TaskContext";
import { useAuth } from "../../contexts/AuthContext";
import TaskCard from "./TaskCard";

const TaskBoard: FC = () => {
  const { tasks, fetchTasks, isLoading } = useTask();
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(filters);
    }
  }, [isAuthenticated, filters]);

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter((task) => task.status === "pending"),
    in_progress: filteredTasks.filter((task) => task.status === "in_progress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="dashboard-hero">
          <h1>Welcome to TaskFlow Pro</h1>
          <p>Organise your work and boost your productivity</p>
          <div className="hero-features">
            <div className="feature">
              <h3>📝 Create Tasks</h3>
              <p>Easily create and manage your tasks</p>
            </div>
            <div className="feature">
              <h3>🎯 Set Priorities</h3>
              <p>Organise tasks by priority and status</p>
            </div>
            <div className="feature">
              <h3>📊 Track Progress</h3>
              <p>Monitor your productivity with stats</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="task-board">
        <div className="board-header">
          <h1>My Task Board</h1>
          <div className="board-actions">
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + New Task
            </button>
          </div>
        </div>
        <TaskStats />

        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="board-columns">
            <div className="column">
              <h3>Pending ({tasksByStatus.pending.length})</h3>
              {tasksByStatus.pending.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            <div className="column">
              <h3>Completed ({tasksByStatus.completed.length})</h3>
              {tasksByStatus.completed.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
        {showForm && <TaskForom onClose={() => setShowForm(false)} />}
      </div>
    </>
  );
};

export default TaskBoard;
