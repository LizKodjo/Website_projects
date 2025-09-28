import "../styles/TaskCard.scss";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    // <>
    <div className="task-card">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark task "${task.title}" as ${
          task.completed ? "incomplete" : "complete"
        }`}
      />
      <span
        style={{ textDecoration: task.completed ? "line-through" : "none" }}
      >
        {task.title}
      </span>
      {task.due_date && (
        <span className="due-date">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </span>
      )}
      {task.category && (
        <span className={`tag tag-${task.category.toLowerCase()}`}>
          {task.category}
        </span>
      )}
      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        x
      </button>
    </div>
    // </>
  );
}
