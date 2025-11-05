import { useState, type FC } from "react";
import type { Task } from "../../types";
import { useTask } from "../../contexts/TaskContext";
import { useToast } from "../../hooks/useToast";

interface TaskCardProps {
  task: Task;
}

const TaskCard: FC<TaskCardProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
  });

  const { updateTask, deleteTask } = useTask();
  const { addToast } = useToast();

  const handleUpdate = async () => {
    try {
      await updateTask(task.id, editData);
      setIsEditing(false);
      addToast("Task updated successfully!", "success");
    } catch (error) {
      addToast("Failed to update task", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
        addToast("Task deleted successfully!", "success");
      } catch (error) {
        addToast("Failed to delete task", "error");
      }
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent";
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "in_progress":
        return "status-in-progress";
      case "pending":
        return "state-pending";
      default:
        return "status-pending";
    }
  };

  return (
    <>
      <div className={`task-card ${getPriorityClass(task.priority)}`}>
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="edit-input"
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="edit-textarea"
              placeholder="Task description"
            />
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="edit-select"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="edit-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <div className="edit-actions">
              <button onClick={handleUpdate} className="btn-primary">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-icon"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-icon"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status.replace("_", " ")}
              </span>
              <span
                className={`priority-badge ${getPriorityClass(task.priority)}`}
              >
                {task.priority}
              </span>
              {task.due_date && (
                <span className="due-date">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="task-footer">
              <span className="task-date">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TaskCard;
