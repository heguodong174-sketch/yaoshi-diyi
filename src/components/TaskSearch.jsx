import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const TaskSearch = () => {
  const { setActiveFilter } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOptions, setSearchOptions] = useState({
    title: true,
    description: true,
    tags: true
  });

  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    const term = e.target.value.trim();
    setSearchTerm(term);
    applySearch(term, searchOptions);
  };

  // 处理搜索选项变化
  const handleOptionChange = (option) => {
    const newOptions = { ...searchOptions, [option]: !searchOptions[option] };
    setSearchOptions(newOptions);
    applySearch(searchTerm, newOptions);
  };

  // 应用搜索过滤
  const applySearch = (term, options) => {
    if (!term) {
      setActiveFilter(null); // 清除搜索过滤
      return;
    }

    // 创建搜索过滤函数
    const searchFunction = (task) => {
      const lowerTerm = term.toLowerCase();
      
      // 检查标题
      if (options.title && task.title.toLowerCase().includes(lowerTerm)) {
        return true;
      }
      
      // 检查描述
      if (options.description && task.description && 
          task.description.toLowerCase().includes(lowerTerm)) {
        return true;
      }
      
      // 检查标签
      if (options.tags && task.tags && Array.isArray(task.tags) &&
          task.tags.some(tag => tag.toLowerCase().includes(lowerTerm))) {
        return true;
      }
      
      // 检查ID（可选功能）
      if (task.id.toLowerCase().includes(lowerTerm)) {
        return true;
      }
      
      return false;
    };
    
    setActiveFilter(searchFunction);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilter(null);
  };

  return (
    <div className="task-search">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="搜索任务..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button className="clear-search-btn" onClick={clearSearch}>
            ×
          </button>
        )}
      </div>
      
      <div className="search-options">
        <label className="search-option">
          <input
            type="checkbox"
            checked={searchOptions.title}
            onChange={() => handleOptionChange('title')}
          />
          <span>标题</span>
        </label>
        
        <label className="search-option">
          <input
            type="checkbox"
            checked={searchOptions.description}
            onChange={() => handleOptionChange('description')}
          />
          <span>描述</span>
        </label>
        
        <label className="search-option">
          <input
            type="checkbox"
            checked={searchOptions.tags}
            onChange={() => handleOptionChange('tags')}
          />
          <span>标签</span>
        </label>
      </div>
    </div>
  );
};

export default TaskSearch;