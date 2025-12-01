import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useTasks } from '../context/TaskContext';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const TaskCard = ({ task, isImportant, isUrgent, index }) => {
  const { toggleTaskCompletion, deleteTask } = useTasks();

  // 格式化截止日期
  const formatDueDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MM月dd日 HH:mm', { locale: zhCN });
    } catch (error) {
      return '日期无效';
    }
  };

  // 处理删除任务
  const handleDelete = () => {
    if (window.confirm(`确定要删除任务「${task.title}」吗？`)) {
      deleteTask(task.id);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index || 0} isDropDisabled={false}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
        >
          <div className="task-card-header">
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => toggleTaskCompletion(task.id)}
                className="task-checkbox-input"
              />
            </div>
            <h3 className="task-title">{task.title}</h3>
            <button 
              className="task-delete-btn"
              onClick={handleDelete}
              aria-label="删除任务"
            >
              ×
            </button>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-card-footer">
            {task.dueDate && (
              <div className="task-due-date">
                📅 {formatDueDate(task.dueDate)}
              </div>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="task-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;