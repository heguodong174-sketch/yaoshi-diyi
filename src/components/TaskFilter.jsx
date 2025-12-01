import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const TaskFilter = () => {
  const { tasks, setActiveFilter } = useTasks();
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    tag: 'all'
  });

  // 获取所有唯一标签
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  const handleFilterChange = (filterType, value) => {
    const newFilter = { ...filter, [filterType]: value };
    setFilter(newFilter);
    
    // 根据筛选条件生成过滤函数
    const filterFunction = task => {
      if (newFilter.status !== 'all' && task.status !== newFilter.status) return false;
      if (newFilter.priority !== 'all' && task.priority !== newFilter.priority) return false;
      if (newFilter.tag !== 'all' && (!task.tags || !task.tags.includes(newFilter.tag))) return false;
      return true;
    };
    
    setActiveFilter(filterFunction);
  };

  const resetFilters = () => {
    const resetFilter = { status: 'all', priority: 'all', tag: 'all' };
    setFilter(resetFilter);
    setActiveFilter(null); // 清除所有过滤
  };

  return (
    <div className="task-filter">
      <h3>筛选任务</h3>
      <div className="filter-group">
        <label>状态筛选</label>
        <select 
          value={filter.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">全部状态</option>
          <option value="pending">待办</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>优先级筛选</label>
        <select 
          value={filter.priority} 
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="all">全部优先级</option>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>标签筛选</label>
        <select 
          value={filter.tag} 
          onChange={(e) => handleFilterChange('tag', e.target.value)}
        >
          <option value="all">全部标签</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      
      {(filter.status !== 'all' || filter.priority !== 'all' || filter.tag !== 'all') && (
        <button className="reset-filter" onClick={resetFilters}>
          重置筛选条件
        </button>
      )}
    </div>
  );
};

export default TaskFilter;