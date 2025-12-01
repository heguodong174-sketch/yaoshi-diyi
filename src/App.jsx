import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import Quadrants from './components/Quadrants';
import TaskModal from './components/TaskModal';
import TaskStatistics from './components/TaskStatistics';
import TaskSearch from './components/TaskSearch';
import TaskFilter from './components/TaskFilter';
import DataManagement from './components/DataManagement';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <TaskProvider>
      <div className="app">
        <header className="app-header">
          <h1>四象限待办事项管理器</h1>
          <button className="add-task-btn" onClick={openModal}>
            + 添加任务
          </button>
        </header>
        
        <div className="app-content">
          <div className="app-sidebar">
            <TaskStatistics />
            <TaskSearch />
            <TaskFilter />
            <DataManagement />
          </div>
          
          <main className="app-main">
            <Quadrants />
          </main>
        </div>
        
        <footer className="app-footer">
          <p>要事第一 - 四象限时间管理法</p>
        </footer>
        
        <TaskModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </TaskProvider>
  );
}

export default App;
