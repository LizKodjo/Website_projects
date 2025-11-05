import { useEffect, useState, type FC } from "react";
import { type TaskStats as TaskStatsType } from "../../types";
import { useToast } from "../../hooks/useToast";
import { apiService } from "../../services/api";

const TaskStats: FC = () => {
  const [stats, setStats] = useState<TaskStatsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getTaskStats();
        setStats(response.stats);
      } catch (error) {
        addToast("Failed to load task statistics", "error");
      } finally {
        setIsLoading;
      }
    };
    fetchStats();
  }, [addToast]);

  if (isLoading) {
    return <div className="stats-loading">Loading statistics...</div>;
  }

  const totalTasks = stats.reduce((sum, stat) => sum + stat.count, 0);
  const completedTasks = stats
    .filter((stat) => stat.status === "completed")
    .reduce((sum, stat) => sum + stat.count, 0);

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <>
      <div className="task-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="stat-number">{totalTasks}</div>
        </div>

        <div className="stat-card">
          <h3>Completion Rate</h3>
          <div className="stat-number">{completionRate.toFixed(1)}%</div>
        </div>

        <div className="stat-card">
          <h3>Completion Rate</h3>
          <div className="stat-number">{completionRate.toFixed(1)}%</div>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">{completedTasks}</div>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="stat-number">
            {stats
              .filter((stat) => stat.status === "in_progress")
              .reduce((sum, stat) => sum + stat.count, 0)}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskStats;
