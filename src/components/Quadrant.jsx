import React from 'react';
import TaskCard from './TaskCard';

const Quadrant = ({ title, isImportant, isUrgent, colorClass, tasks }) => {
  // 获取已完成和未完成的任务数量
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className={`quadrant ${colorClass}`}>
      <div className="quadrant-header">
        <h2>{title}</h2>
        <div className="quadrant-stats">
          <span className="pending-count">{pendingTasks} 待办</span>
          <span className="completed-count">{completedTasks} 已完成</span>
        </div>
      </div>
      <div className="quadrant-tasks">
        {tasks.length === 0 ? (
          <div className="empty-quadrant">
            <p>此象限暂无任务</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              isImportant={isImportant}
              isUrgent={isUrgent}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Quadrant;