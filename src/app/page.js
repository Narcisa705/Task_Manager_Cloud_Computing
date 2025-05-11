'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return;

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTask }),
    });

    const data = await res.json();
    if (data.title) {
      setTasks([...tasks, data]);
      setNewTask('');
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Adaugă un task"
      />
      <button onClick={addTask}>Adaugă task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} {task.completed ? '(Completat)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
