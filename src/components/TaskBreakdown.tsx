import React, { useState } from 'react';
import { Task } from '../types';
import { Clock, ArrowLeft, Play } from 'lucide-react';

interface TaskBreakdownProps {
  task: Task;
  onReset: () => void;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ task, onReset }) => {
  const [activeSubtask, setActiveSubtask] = useState<number | null>(null);

  const startTimer = (index: number) => {
    setActiveSubtask(index);
    // In a real implementation, we would start a timer here
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-teal-500 text-white p-4">
        <h2 className="text-2xl font-bold">{task.name}</h2>
        <p className="flex items-center mt-2">
          <Clock className="mr-2" size={18} />
          Estimated time: {task.estimatedTime} minutes
        </p>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">Subtasks:</h3>
        <ul>
          {task.subtasks.map((subtask, index) => (
            <li key={index} className="mb-4 p-3 bg-gray-100 rounded-lg flex justify-between items-center">
              <span>{subtask.name} ({subtask.estimatedTime} min)</span>
              <button
                onClick={() => startTimer(index)}
                className={`px-3 py-1 rounded ${
                  activeSubtask === index ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                <Play size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4">
        <button
          onClick={onReset}
          className="flex items-center text-teal-500 hover:text-teal-700"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to task input
        </button>
      </div>
    </div>
  );
};

export default TaskBreakdown;