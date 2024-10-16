import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskBreakdown from './components/TaskBreakdown';
import TaskLibrary from './components/TaskLibrary';
import { Task } from './types';
import { Brain } from 'lucide-react';
import axios from 'axios';

function App() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskLibrary, setTaskLibrary] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTaskLibrary();
  }, []);

  const fetchTaskLibrary = async () => {
    try {
      console.log('Fetching task library...');
      const response = await axios.get('/api/tasks');
      console.log('Task library response:', response.data);
      setTaskLibrary(response.data);
    } catch (error) {
      console.error('Error fetching task library:', error);
      setError('Failed to fetch task library. Please try again later.');
    }
  };

  const handleTaskSubmit = async (taskName: string) => {
    try {
      console.log('Submitting task:', taskName);
      const response = await axios.post('/api/tasks', { name: taskName });
      console.log('Task submission response:', response.data);
      setCurrentTask(response.data);
      await fetchTaskLibrary();
    } catch (error) {
      console.error('Error submitting task:', error);
      setError('Failed to submit task. Please try again later.');
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      console.log('Removing task:', taskId);
      await axios.delete(`/api/tasks/${taskId}`);
      await fetchTaskLibrary();
      if (currentTask && currentTask.id === taskId) {
        setCurrentTask(null);
      }
    } catch (error) {
      console.error('Error removing task:', error);
      setError('Failed to remove task. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center">
          <Brain className="mr-2" size={32} />
          Andy's Anti Procrastination
        </h1>
        <p className="text-gray-600 mt-2">Break down your tasks and conquer procrastination</p>
      </header>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!currentTask ? (
        <div className="w-full max-w-md">
          <TaskInput onTaskSubmit={handleTaskSubmit} />
          <TaskLibrary tasks={taskLibrary} onSelectTask={setCurrentTask} onRemoveTask={handleRemoveTask} />
        </div>
      ) : (
        <TaskBreakdown task={currentTask} onReset={() => setCurrentTask(null)} />
      )}
    </div>
  );
}

export default App;