import React from 'react';
import { Task } from '../types';
import { Clock, Trash2 } from 'lucide-react';

interface TaskLibraryProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
}

const TaskLibrary: React.FC<TaskLibraryProps> = ({ tasks, onSelectTask, onRemoveTask }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Task Library</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 flex justify-between items-center"
          >
            <div
              className="flex-grow cursor-pointer"
              onClick={() => onSelectTask(task)}
            >
              <h3 className="font-semibold">{task.name}</h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Clock size={14} className="mr-1" />
                {task.estimatedTime} minutes
              </p>
            </div>
            <button
              onClick={() => onRemoveTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskLibrary;