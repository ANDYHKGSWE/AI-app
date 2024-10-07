import express from 'express';
import path from 'path';
import { OpenAI } from 'openai';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

console.log('Configuring OpenAI...');
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// AI service for task breakdown and time estimation
const aiService = async (task) => {
	const prompt = `Break down the task "${task}" into 4-6 subtasks, each with an estimated time in minutes. Format the response as a JSON object with "name" (string), "estimatedTime" (number), and "subtasks" (array of objects with "name" and "estimatedTime").`;

	try {
		console.log('Sending request to OpenAI...');
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: prompt }],
		});
		console.log('Received response from OpenAI');

		const result = JSON.parse(response.choices[0].message.content);
		return result;
	} catch (error) {
		console.error('Error calling OpenAI:', error);
		if (error.code === 'insufficient_quota') {
			throw new Error(
				'You have exceeded your OpenAI quota. Please check your plan and billing details.'
			);
		}
		return null;
	}
};

let taskLibrary = [];

app.post('/api/tasks', async (req, res) => {
	console.log('POST /api/tasks received');
	const { name } = req.body;
	console.log('Received task:', name);
	try {
		const task = await aiService(name);
		if (task) {
			task.id = Date.now().toString();
			taskLibrary.push(task);
			console.log('Task added to library:', task);
			res.json(task);
		} else {
			console.error('Failed to generate task breakdown');
			res.status(500).json({ error: 'Failed to generate task breakdown' });
		}
	} catch (error) {
		console.error('Error processing task:', error);
		res.status(500).json({ error: error.message || 'Internal server error' });
	}
});

app.get('/api/tasks', (req, res) => {
	console.log('GET /api/tasks received');
	console.log('Sending task library:', taskLibrary);
	res.json(taskLibrary);
});

app.delete('/api/tasks/:id', (req, res) => {
	console.log('DELETE /api/tasks/:id received');
	const { id } = req.params;
	console.log('Deleting task:', id);
	taskLibrary = taskLibrary.filter((task) => task.id !== id);
	res.json({ success: true });
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

// Error handling
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
