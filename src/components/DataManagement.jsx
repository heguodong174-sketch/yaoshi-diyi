import React, { useState, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import DataManager from '../utils/dataManager';

const DataManagement = () => {
  const { tasks, setTasks } = useTasks();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success, error, info
  const fileInputRef = useRef(null);

  // 显示消息通知
  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // 导出任务数据
  const handleExport = () => {
    if (tasks.length === 0) {
      showMessage('当前没有任务可导出', 'info');
      return;
    }
    
    const result = DataManager.exportTasks(tasks);
    showMessage(result.message, result.success ? 'success' : 'error');
  };

  // 触发文件选择
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // 处理文件导入
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.name.endsWith('.json')) {
      showMessage('请选择JSON格式的文件', 'error');
      return;
    }

    const result = await DataManager.importTasks(file);
    if (result.success) {
      setTasks(result.tasks);
      showMessage(result.message, 'success');
    } else {
      showMessage(result.message, 'error');
    }

    // 重置文件输入
    event.target.value = '';
  };

  // 创建备份
  const handleBackup = () => {
    if (tasks.length === 0) {
      showMessage('当前没有任务可备份', 'info');
      return;
    }

    const result = DataManager.createBackup(tasks);
    showMessage(result.message, result.success ? 'success' : 'error');
  };

  // 恢复备份
  const handleRestore = () => {
    const result = DataManager.restoreBackup();
    if (result.success) {
      setTasks(result.tasks);
      showMessage(result.message, 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  // 清除所有数据
  const handleClearData = () => {
    if (window.confirm('确定要清除所有任务数据吗？此操作不可撤销！')) {
      const result = DataManager.clearAllData();
      if (result.success) {
        setTasks([]);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    }
  };

  // 获取存储信息
  const storageInfo = DataManager.getStorageInfo();

  return (
    <div className="data-management">
      <h3>数据管理</h3>
      
      {/* 消息提示 */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* 导出功能 */}
      <div className="data-section">
        <h4>数据导出</h4>
        <p>将所有任务导出为JSON文件</p>
        <button className="action-btn export-btn" onClick={handleExport}>
          导出数据
        </button>
      </div>

      {/* 导入功能 */}
      <div className="data-section">
        <h4>数据导入</h4>
        <p>从JSON文件导入任务数据</p>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button className="action-btn import-btn" onClick={handleImportClick}>
          导入数据
        </button>
      </div>

      {/* 备份功能 */}
      <div className="data-section">
        <h4>备份管理</h4>
        <p>在本地创建和恢复任务备份</p>
        <div className="backup-actions">
          <button className="action-btn backup-btn" onClick={handleBackup}>
            创建备份
          </button>
          <button className="action-btn restore-btn" onClick={handleRestore}>
            恢复备份
          </button>
        </div>
      </div>

      {/* 存储信息 */}
      {storageInfo.success && (
        <div className="data-section storage-info">
          <h4>存储信息</h4>
          <div className="storage-stats">
            <div className="stat-item">
              <span className="stat-label">任务数据:</span>
              <span className="stat-value">{storageInfo.tasksSize} KB</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">备份数据:</span>
              <span className="stat-value">{storageInfo.backupSize} KB</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">总计:</span>
              <span className="stat-value">{storageInfo.totalSize} KB</span>
            </div>
          </div>
        </div>
      )}

      {/* 危险操作 */}
      <div className="data-section danger-zone">
        <h4>危险操作</h4>
        <button className="action-btn danger-btn" onClick={handleClearData}>
          清除所有数据
        </button>
        <p className="danger-warning">警告：此操作将删除所有任务和备份，且无法恢复！</p>
      </div>
    </div>
  );
};

export default DataManagement;