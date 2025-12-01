// 数据管理工具类
export const DataManager = {
  // 保存任务数据到localStorage
  saveTasks(tasks) {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return { success: true, message: '数据保存成功' };
    } catch (error) {
      console.error('保存数据失败:', error);
      return { success: false, message: '保存数据失败', error };
    }
  },

  // 从localStorage加载任务数据
  loadTasks() {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('加载数据失败:', error);
      return [];
    }
  },

  // 导出任务数据为JSON文件
  exportTasks(tasks) {
    try {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `tasks_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return { success: true, message: '数据导出成功' };
    } catch (error) {
      console.error('导出数据失败:', error);
      return { success: false, message: '导出数据失败', error };
    }
  },

  // 导入任务数据
  importTasks(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const tasks = JSON.parse(e.target.result);
          
          // 验证导入的数据格式
          if (!Array.isArray(tasks)) {
            throw new Error('导入的数据格式错误，必须是任务数组');
          }
          
          // 验证每个任务对象的基本结构
          const validTasks = tasks.filter(task => {
            return task && 
                   typeof task.id === 'string' &&
                   typeof task.title === 'string';
          });
          
          if (validTasks.length === 0) {
            throw new Error('导入的数据中没有有效的任务');
          }
          
          resolve({ success: true, tasks: validTasks, message: `成功导入 ${validTasks.length} 个任务` });
        } catch (error) {
          console.error('导入数据失败:', error);
          resolve({ success: false, message: `导入失败: ${error.message}` });
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, message: '文件读取失败' });
      };
      
      reader.readAsText(file);
    });
  },

  // 创建备份
  createBackup(tasks) {
    try {
      const backup = {
        tasks,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem('tasks_backup', JSON.stringify(backup));
      return { success: true, message: '备份创建成功' };
    } catch (error) {
      console.error('创建备份失败:', error);
      return { success: false, message: '创建备份失败', error };
    }
  },

  // 恢复备份
  restoreBackup() {
    try {
      const backupStr = localStorage.getItem('tasks_backup');
      if (!backupStr) {
        return { success: false, message: '没有找到备份' };
      }
      
      const backup = JSON.parse(backupStr);
      return {
        success: true, 
        tasks: backup.tasks, 
        message: `从 ${new Date(backup.timestamp).toLocaleString()} 的备份恢复成功`
      };
    } catch (error) {
      console.error('恢复备份失败:', error);
      return { success: false, message: '恢复备份失败', error };
    }
  },

  // 清除所有数据
  clearAllData() {
    try {
      localStorage.removeItem('tasks');
      localStorage.removeItem('tasks_backup');
      return { success: true, message: '所有数据已清除' };
    } catch (error) {
      console.error('清除数据失败:', error);
      return { success: false, message: '清除数据失败', error };
    }
  },

  // 获取存储空间使用情况
  getStorageInfo() {
    try {
      const tasksStr = localStorage.getItem('tasks') || '';
      const backupStr = localStorage.getItem('tasks_backup') || '';
      
      // 计算存储空间使用情况（以KB为单位）
      const tasksSize = new Blob([tasksStr]).size / 1024;
      const backupSize = new Blob([backupStr]).size / 1024;
      const totalSize = tasksSize + backupSize;
      
      return {
        success: true,
        tasksSize: tasksSize.toFixed(2),
        backupSize: backupSize.toFixed(2),
        totalSize: totalSize.toFixed(2)
      };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return { success: false, message: '获取存储信息失败', error };
    }
  }
};

export default DataManager;