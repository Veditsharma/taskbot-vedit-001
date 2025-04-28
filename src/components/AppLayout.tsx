import { useState } from "react";
import { Task } from "../types";
import KanbanBoard from "./KanbanBoard";
import ChatInterface from "./ChatInterface";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, User, Settings, Target, Flag } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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
  };
  
  const handleAddTaskFromChat = (task: Task) => {
    setChatAddedTasks(prev => [...prev, task]);
  };

  return (
    <div className="container mx-auto py-6 px-4 h-screen flex flex-col bg-[#0A0A0A]">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary rounded-full p-0.5 bg-primary/20" />
            <h1 className="text-xl font-semibold text-white">Task boat</h1>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-[#191919] text-gray-400">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </NavigationMenuTrigger>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-[#191919] text-gray-400">
                  <Target className="mr-2 h-4 w-4" />
                  Goals
                </NavigationMenuTrigger>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-[#191919] text-gray-400">
                  <Flag className="mr-2 h-4 w-4" />
                  Projects
                </NavigationMenuTrigger>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-[#191919] text-gray-400">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <p className="text-sm text-gray-400 ml-7">
          Clear power task management system
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 flex-1 h-[calc(100%-100px)] overflow-hidden">
        <div className="w-full md:w-2/3 overflow-auto">
          <Tabs defaultValue="board" className="h-full">
            <TabsList className="bg-transparent border-0 p-0 mb-4">
              <TabsTrigger 
                value="board" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md px-4"
              >
                Board
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md px-4"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-0 h-[calc(100%-40px)]">
              <KanbanBoard 
                onTaskUpdate={handleTaskUpdate} 
                additionalTasks={chatAddedTasks}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="bg-[#121212] p-6 rounded-xl border border-gray-800 text-center">
                <h3 className="text-lg font-medium mb-2">Task History</h3>
                <p className="text-gray-400">
                  View your completed and archived tasks here
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
