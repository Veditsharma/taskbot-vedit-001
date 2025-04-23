
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Task, COLUMNS } from "../types";
import { PlusIcon, Check, Clock, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";
import { mockTasks } from "../mock-data";

interface KanbanBoardProps {
  onTaskUpdate: (updatedTask: Task) => void;
}

const KanbanBoard = ({ onTaskUpdate }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task that was dragged
    const draggedTask = tasks.find(task => task.id === draggableId);
    if (!draggedTask) return;

    // Create a new array with the task removed from its original position
    const newTasks = [...tasks];
    const updatedTask = {
      ...draggedTask,
      column: destination.droppableId as "not-started" | "in-progress" | "done"
    };

    // Replace the task with the updated one
    const taskIndex = newTasks.findIndex(task => task.id === draggableId);
    newTasks[taskIndex] = updatedTask;
    
    setTasks(newTasks);
    onTaskUpdate(updatedTask);
  };

  const getColumnIcon = (columnId: string) => {
    switch(columnId) {
      case "not-started": return <Circle className="h-4 w-4 text-gray-400" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "done": return <Check className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getColumnTasks = (columnId: string) => {
    return tasks.filter(task => task.column === columnId);
  };

  const handleAddNewTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: "New Task",
      description: "",
      priority: "medium",
      tags: [],
      column: columnId as "not-started" | "in-progress" | "done",
      createdBy: "user",
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {COLUMNS.map((column) => (
          <div key={column.id} className="task-column animate-pulse">
            <h3 className="font-medium mb-4 flex items-center gap-2 text-muted-foreground">
              {getColumnIcon(column.id)}
              <span>{column.title}</span>
              <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs ml-2">0</span>
            </h3>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {COLUMNS.map((column) => (
          <div key={column.id} className="task-column">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              {getColumnIcon(column.id)}
              <span>{column.title}</span>
              <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs ml-2">
                {getColumnTasks(column.id).length}
              </span>
            </h3>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  className="droppable-container"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {getColumnTasks(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard 
                            task={task} 
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-muted-foreground border border-dashed"
                    onClick={() => handleAddNewTask(column.id)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> New task
                  </Button>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
