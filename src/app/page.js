'use client';
import '../../styles/globals.css';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { Plus } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // Aici am adăugat useState pentru filter

  const [deadline, setDeadline] = useState(''); // Pentru data deadline
  const [deadlineTime, setDeadlineTime] = useState(''); // Pentru ora deadline

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) => [...prevTasks]); // forțăm re-render
    }, 60000); // 1 minut

    return () => clearInterval(interval); // curățare
  }, []);

  const addTask = async () => {
    if (!newTask) return;

    // Creează un obiect Date corect din data și ora locală
    const localDeadline = new Date(`${deadline}T${deadlineTime}:00`);

    // Convertește la UTC
    const deadlineDateUTC = new Date(localDeadline.toISOString()); // `.toISOString()` garantează formatul UTC corect

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTask, deadline: deadlineDateUTC }),
    });

    const data = await res.json();
    if (data.title) {
      setTasks([...tasks, data]);
      setNewTask('');
      setDeadline('');
      setDeadlineTime('');
    }
  };

  // Funcție pentru a filtra task-urile
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'notCompleted') return !task.completed;
    return true; // 'all' - toate task-urile
  });

  // Funcție pentru a sorta task-urile
  const sortedTasks = filteredTasks.sort((a, b) => {
    const deadlineA = new Date(a.deadline);
    const deadlineB = new Date(b.deadline);

    return deadlineA - deadlineB; // Sortează crescător după deadline
  });

  const isDeadlineNear = (deadline) => {
    if (!deadline) return false;
    const now = new Date();
    const taskDeadline = new Date(deadline);
    const diffInMs = taskDeadline - now;
    console.log(diffInMs); // Adaugă un log pentru a vedea diferența în milisecunde
    return diffInMs > 0 && diffInMs <= 60 * 60 * 1000; // mai puțin de o oră
  };

  // Funcție pentru a verifica dacă deadline-ul este trecut
  const isDeadlinePassed = (deadline) => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    return taskDeadline < now;
  };

  // Funcție pentru a comuta completarea unui task
  const toggleComplete = async (taskId, currentStatus) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      ));
    } else {
      console.error('Eroare la actualizarea task-ului');
    }
  };

  // Ștergerea unui task
  const deleteTask = async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setTasks(tasks.filter((task) => task._id !== taskId));
    } else {
      console.error('Eroare la ștergerea task-ului');
    }
  };

  return (
    <div className="task-manager">
      <h1 className="title">MyToDo</h1>
      <div className="input-container">
        <input
          className="task-input"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Adaugă un task"
        />
        <input
          className="task-input"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="Deadline"
        />
        <input
          className="task-input"
          type="time"
          value={deadlineTime}
          onChange={(e) => setDeadlineTime(e.target.value)}
          placeholder="Ora"
        />
        <button className="add-task-btn" onClick={addTask} aria-label="Adaugă task">
          <Plus size={18} />
        </button>
      </div>

      <div className="filter-container">
        <select className="filter" onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">Toate task-urile</option>
          <option value="completed">Task-uri completate</option>
          <option value="notCompleted">Task-uri necompletate</option>
        </select>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task._id} className={`task-item ${task.completed ? 'completed' : isDeadlineNear(task.deadline) ? 'urgent' : ''}`}>
            <div className="task-main">
              <span className="task-title"><strong>{task.title}</strong></span>
              {task.deadline && (
                <div className="task-deadline">
                  <strong>Deadline:</strong><br />
                  {new Date(task.deadline).toLocaleDateString('ro-RO')}<br />
                  {new Date(task.deadline).toLocaleTimeString('ro-RO')}
                </div>
              )}
              {!task.completed && isDeadlinePassed(task.deadline) && <span className="incomplete-tag"> (Sarcina neefectuată)</span>}
              {task.completed && <span className="completed-tag"> (Efectuat)</span>}
            </div>

            <div className="task-actions">
              <button className="toggle-btn" onClick={() => toggleComplete(task._id, task.completed)} aria-label="Comută status task">
                {task.completed ? <RotateCcw size={18} /> : <CheckCircle size={18} />}
              </button>

              <button className="delete-btn" onClick={() => deleteTask(task._id)} aria-label="Șterge task">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
