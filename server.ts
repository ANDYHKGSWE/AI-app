import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Configuration, OpenAIApi } from 'openai';

const startServer = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use(express.json());

  // Configure OpenAI
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // AI service for task breakdown and time estimation
  const aiService = async (task: string) => {
    const prompt = `Break down the task "${task}" into 4-6 subtasks, each with an estimated time in minutes. Format the response as a JSON object with "name" (string), "estimatedTime" (number), and "subtasks" (array of objects with "name" and "estimatedTime").`;

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      const result = JSON.parse(response.data.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return null;
    }
  };

  // In-memory task library
  let taskLibrary: any[] = [];

  app.post('/api/tasks', async (req, res) => {
    const { name } = req.body;
    const task = await aiService(name);
    if (task) {
      task.id = Date.now().toString(); // Add a unique id to the task
      taskLibrary.push(task);
      res.json(task);
    } else {
      res.status(500).json({ error: 'Failed to generate task breakdown' });
    }
  });

  app.get('/api/tasks', (req, res) => {
    res.json(taskLibrary);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    taskLibrary = taskLibrary.filter(task => task.id !== id);
    res.json({ success: true });
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();