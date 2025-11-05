import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { useTask } from "../../contexts/TaskContext";
import { useToast } from "../../hooks/useToast";

interface TaskFormProps {
  onClose: () => void;
}

const TaskForm: FC<TaskFormProps> = ({ onClose }) => {
  const [formData, setFormdata] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  const { createTask } = useTask();
  const { addToast } = useToast();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createTask({
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      });

      addToast("Task created successfully!", "success");
      onClose();
    } catch (error: any) {
      addToast(
        error.response?.data?.detail || "Failed to create task",
        "error"
      );
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Create New Task</h2>
            <button onClick={onClose} className="close-button">
              x
            </button>
          </div>
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter task description (optional)"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
              <input
                type="datetime=local"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default TaskForm;
