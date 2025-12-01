import React from 'react';
import { useTasks } from '../context/TaskContext';

const TaskStatistics = () => {
  const { tasks } = useTasks();

  // 计算统计数据
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 按象限统计
  const quadrantStats = {
    importantUrgent: tasks.filter(t => t.isImportant && t.isUrgent).length,
    importantNotUrgent: tasks.filter(t => t.isImportant && !t.isUrgent).length,
    notImportantUrgent: tasks.filter(t => !t.isImportant && t.isUrgent).length,
    notImportantNotUrgent: tasks.filter(t => !t.isImportant && !t.isUrgent).length
  };

  return (
    <div className="task-statistics">
      <h3>任务统计</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">总任务数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pendingTasks}</div>
          <div className="stat-label">待办任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">已完成任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completionRate}%</div>
          <div className="stat-label">完成率</div>
        </div>
      </div>
      
      <div className="quadrant-stats">
        <h4>象限分布</h4>
        <div className="quadrant-stats-grid">
          <div className="quadrant-stat-item quadrant-red">
            <span className="quadrant-name">重要且紧急</span>
            <span className="quadrant-count">{quadrantStats.importantUrgent}</span>
          </div>
          <div className="quadrant-stat-item quadrant-blue">
            <span className="quadrant-name">重要不紧急</span>
            <span className="quadrant-count">{quadrantStats.importantNotUrgent}</span>
          </div>
          <div className="quadrant-stat-item quadrant-yellow">
            <span className="quadrant-name">不重要但紧急</span>
            <span className="quadrant-count">{quadrantStats.notImportantUrgent}</span>
          </div>
          <div className="quadrant-stat-item quadrant-gray">
            <span className="quadrant-name">不重要不紧急</span>
            <span className="quadrant-count">{quadrantStats.notImportantNotUrgent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatistics;