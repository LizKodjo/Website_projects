import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import TaskCard from "./TaskCard";

export default function AnimatedTaskCard({ task, onToggle, onDelete }) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      key={task.id}
      timeout={300}
      classNames="task"
      nodeRef={nodeRef}
    >
      <div ref={nodeRef}>
        <TaskCard task={task} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </CSSTransition>
  );
}
