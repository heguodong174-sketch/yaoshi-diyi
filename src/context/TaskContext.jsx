import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建任务Context
const TaskContext = createContext();

// 任务Context Provider组件
export const TaskProvider = ({ children }) => {
  const [tasks, setTasksState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  // 从localStorage加载任务数据
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          setTasksState(JSON.parse(savedTasks));
        } else {
          // 初始化一些示例任务
          const initialTasks = [
            {
              id: '1',
              title: '完成项目报告',
              description: '准备季度项目总结报告',
              isImportant: true,
              isUrgent: true,
              status: 'pending',
              priority: 'high',
              dueDate: new Date().toISOString(),
              creationDate: new Date().toISOString(),
              tags: ['工作']
            },
            {
              id: '2',
              title: '学习React',
              description: '学习React hooks高级用法',
              isImportant: true,
              isUrgent: false,
              status: 'pending',
              priority: 'medium',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              creationDate: new Date().toISOString(),
              tags: ['学习']
            },
            {
              id: '3',
              title: '回复邮件',
              description: '回复客户咨询邮件',
              isImportant: false,
              isUrgent: true,
              status: 'pending',
              priority: 'medium',
              dueDate: new Date().toISOString(),
              creationDate: new Date().toISOString(),
              tags: ['工作']
            },
            {
              id: '4',
              title: '看电影',
              description: '观看新上映的电影',
              isImportant: false,
              isUrgent: false,
              status: 'pending',
              priority: 'low',
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              creationDate: new Date().toISOString(),
              tags: ['娱乐']
            }
          ];
          setTasksState(initialTasks);
        }
      } catch (error) {
        console.error('加载任务失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // 保存任务到localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // 添加任务
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      creationDate: new Date().toISOString(),
      status: 'pending',
      ...taskData
    };
    setTasksState([...tasks, newTask]);
  };

  // 更新任务
  const updateTask = (id, updatedData) => {
    setTasksState(tasks.map(task => 
      task.id === id ? { ...task, ...updatedData, lastUpdated: new Date().toISOString() } : task
    ));
  };

  // 删除任务
  const deleteTask = (id) => {
    setTasksState(tasks.filter(task => task.id !== id));
  };

  // 切换任务完成状态
  const toggleTaskCompletion = (id) => {
    setTasksState(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        return {
          ...task,
          status: newStatus,
          completionDate: newStatus === 'completed' ? new Date().toISOString() : null,
          lastUpdated: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  // 移动任务到其他象限
  const moveTaskToQuadrant = (id, isImportant, isUrgent) => {
    updateTask(id, { isImportant, isUrgent });
  };

  // 按象限获取任务
  const getTasksByQuadrant = (isImportant, isUrgent) => {
    const filteredTasks = activeFilter 
      ? tasks.filter(activeFilter)
      : tasks;
    return filteredTasks.filter(task => task.isImportant === isImportant && task.isUrgent === isUrgent);
  };

  // 批量设置任务（用于导入和恢复备份）
  const replaceTasks = (newTasks) => {
    setTasksState(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const value = {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTaskToQuadrant,
    getTasksByQuadrant,
    activeFilter,
    setActiveFilter,
    setTasks: replaceTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// 自定义Hook，方便使用Context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks必须在TaskProvider内部使用');
  }
  return context;
};