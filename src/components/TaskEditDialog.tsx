
import { useState } from "react";
import { Task, FIELD_OPTIONS } from "../types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Tag, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskEditDialog = ({ task, isOpen, onClose, onSave }: TaskEditDialogProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority);
  const [field, setField] = useState(task.field || '');
  const [deadline, setDeadline] = useState<Date | undefined>(
    task.deadline ? new Date(task.deadline) : undefined
  );

  const handleSave = () => {
    onSave({
      ...task,
      title,
      description,
      priority,
      field,
      deadline: deadline?.toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border border-gray-800 p-6 rounded-3xl max-w-md w-full">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Title</h2>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#121212] border-gray-800 text-gray-300 h-14 rounded-2xl text-lg"
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Description</h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#121212] border-gray-800 text-gray-300 min-h-[100px] rounded-2xl text-lg resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Priority</h2>
            <ToggleGroup 
              type="single" 
              value={priority}
              onValueChange={(value) => {
                if (value) setPriority(value as "low" | "medium" | "high");
              }}
              className="flex justify-start gap-3"
            >
              <ToggleGroupItem 
                value="high"
                className="bg-[#121212] hover:bg-[#1a1a1a] data-[state=on]:bg-red-500/20 data-[state=on]:text-red-400 data-[state=on]:border-red-500/50 border border-gray-800 rounded-full px-6 py-2"
              >
                High
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="medium"
                className="bg-[#121212] hover:bg-[#1a1a1a] data-[state=on]:bg-yellow-500/20 data-[state=on]:text-yellow-400 data-[state=on]:border-yellow-500/50 border border-gray-800 rounded-full px-6 py-2"
              >
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="low"
                className="bg-[#121212] hover:bg-[#1a1a1a] data-[state=on]:bg-green-500/20 data-[state=on]:text-green-400 data-[state=on]:border-green-500/50 border border-gray-800 rounded-full px-6 py-2"
              >
                Low
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Date</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-[#121212] border-gray-800 text-gray-300 h-14 rounded-2xl text-lg justify-start"
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {deadline ? format(deadline, "MMMM do, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="bg-[#121212] rounded-xl border border-gray-800 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {FIELD_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setField(option)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                    field === option
                      ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-400"
                      : "border-gray-800 bg-[#121212] text-gray-400 hover:bg-[#1a1a1a]"
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-full px-6 bg-transparent border-gray-800 hover:bg-[#1a1a1a] text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-full px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
