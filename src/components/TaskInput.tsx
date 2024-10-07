import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TaskInputProps {
  onTaskSubmit: (taskName: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onTaskSubmit }) => {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onTaskSubmit(taskName);
      setTaskName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Enter a daunting task..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          <PlusCircle size={24} />
        </button>
      </div>
    </form>
  );
};

export default TaskInput;