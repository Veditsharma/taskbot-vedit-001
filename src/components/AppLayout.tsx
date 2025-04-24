
import { useState } from "react";
import { Task } from "../types";
import KanbanBoard from "./KanbanBoard";
import ChatInterface from "./ChatInterface";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Tag, CircleCheck, Flag, Calendar, Plus, Trash2 } from "lucide-react";

const AppLayout = () => {
  const { toast } = useToast();
  const [chatAddedTasks, setChatAddedTasks] = useState<Task[]>([]);
  
  const handleTaskUpdate = (task: Task) => {
    toast({
      title: "Task updated",
      description: `"${task.title}" moved to ${task.column.replace("-", " ")}`,
    });
  };

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // In a real implementation, this would send the message to an API
  };
  
  const handleAddTaskFromChat = (task: Task) => {
    setChatAddedTasks(prev => [...prev, task]);
  };

  return (
    <div className="container mx-auto py-6 px-4 h-screen flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <CircleCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">CreodoBot TaskTracker</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered task management made simple
        </p>
      </header>

      <Separator className="my-4" />

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-[calc(100%-100px)] overflow-hidden">
        <div className="w-full md:w-2/3 overflow-auto">
          <Tabs defaultValue="board">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="board" className="flex items-center gap-1">
                  <Tag className="h-4 w-4" /> Board
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> History
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="board" className="mt-0">
              <KanbanBoard 
                onTaskUpdate={handleTaskUpdate} 
                additionalTasks={chatAddedTasks}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="bg-card p-6 rounded-lg border text-center">
                <h3 className="text-lg font-medium mb-2">Task History</h3>
                <p className="text-muted-foreground">
                  This tab will show the history of tasks that were added or modified
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-1/3 h-full">
          <ChatInterface 
            onSendMessage={handleSendMessage} 
            onAddTask={handleAddTaskFromChat}
          />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
