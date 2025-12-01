import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const TaskModal = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  
  // 任务表单状态
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    isImportant: false,
    isUrgent: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    tags: ''
  });

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!taskForm.title.trim()) {
      alert('请输入任务标题');
      return;
    }

    // 处理标签
    const tagsArray = taskForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // 创建任务
    addTask({
      ...taskForm,
      tags: tagsArray,
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : null
    });

    // 重置表单
    setTaskForm({
      title: '',
      description: '',
      isImportant: false,
      isUrgent: false,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      tags: ''
    });

    // 关闭模态框
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>添加新任务</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">任务标题 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskForm.title}
              onChange={handleInputChange}
              placeholder="请输入任务标题"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">任务描述</label>
            <textarea
              id="description"
              name="description"
              value={taskForm.description}
              onChange={handleInputChange}
              placeholder="请输入任务描述（可选）"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>任务分类（四象限）</label>
            <div className="quadrant-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isImportant"
                  checked={taskForm.isImportant}
                  onChange={handleInputChange}
                />
                <span>重要</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={taskForm.isUrgent}
                  onChange={handleInputChange}
                />
                <span>紧急</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">优先级</label>
            <select
              id="priority"
              name="priority"
              value={taskForm.priority}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">截止日期</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">标签（用逗号分隔）</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={taskForm.tags}
              onChange={handleInputChange}
              placeholder="例如：工作,学习,个人"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              添加任务
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;