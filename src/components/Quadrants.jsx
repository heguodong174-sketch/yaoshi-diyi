import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Quadrant from './Quadrant';
import { useTasks } from '../context/TaskContext';

const Quadrants = () => {
  const { tasks, moveTaskToQuadrant } = useTasks();

  // 拖拽结束处理函数
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // 如果没有目标位置或源位置和目标位置相同，则不做任何操作
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    // 解析目标象限的属性
    const [isImportant, isUrgent] = destination.droppableId.split('-').slice(1).map(Boolean);

    // 移动任务到目标象限
    moveTaskToQuadrant(draggableId, isImportant, isUrgent);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="quadrants-container">
        {/* 第一象限：重要且紧急 */}
        <Droppable droppableId="quadrant-true-true" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="quadrant-wrapper"
            >
              <Quadrant
                title="重要且紧急"
                isImportant={true}
                isUrgent={true}
                colorClass="quadrant-red"
                tasks={tasks.filter(t => t.isImportant && t.isUrgent)}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 第二象限：重要不紧急 */}
        <Droppable droppableId="quadrant-true-false" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="quadrant-wrapper"
            >
              <Quadrant
                title="重要不紧急"
                isImportant={true}
                isUrgent={false}
                colorClass="quadrant-blue"
                tasks={tasks.filter(t => t.isImportant && !t.isUrgent)}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 第三象限：不重要但紧急 */}
        <Droppable droppableId="quadrant-false-true" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="quadrant-wrapper"
            >
              <Quadrant
                title="不重要但紧急"
                isImportant={false}
                isUrgent={true}
                colorClass="quadrant-yellow"
                tasks={tasks.filter(t => !t.isImportant && t.isUrgent)}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* 第四象限：不重要不紧急 */}
        <Droppable droppableId="quadrant-false-false" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="quadrant-wrapper"
            >
              <Quadrant
                title="不重要不紧急"
                isImportant={false}
                isUrgent={false}
                colorClass="quadrant-gray"
                tasks={tasks.filter(t => !t.isImportant && !t.isUrgent)}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default Quadrants;