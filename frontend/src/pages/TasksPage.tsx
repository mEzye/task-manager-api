import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { type Task } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';

/**
 * TasksPage Component
 * -------------------
 * Main dashboard for the user.
 * Displays tasks, handles CRUD operations.
 */
const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // UI State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  // Retrieve token for UI display
  // Note: We use this purely for display. The real auth check happens via API calls.
  const token = localStorage.getItem('accessToken') || '';
  
  // Create a display name (snippet) from the token
  const userSnippet = token.length > 10 ? `${token.substring(0, 8)}...` : 'User';

  const currentDate = new Date().toLocaleDateString('uk-UA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  // --- Effects ---

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch all tasks from the API.
   * If the user is invalid (401), the Axios interceptor (client.ts) handles the redirect.
   * However, we also catch errors here to prevent UI glitches.
   */
  const fetchTasks = async () => {
    try {
      const res = await client.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      
      // Fallback: If axios interceptor cleared storage but didn't redirect fast enough
      if (!localStorage.getItem('accessToken')) {
        navigate('/login');
      }
    }
  };

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Task>) => {
    try {
      if (editingTask) {
        await client.put(`/tasks/${editingTask.id}`, data);
      } else {
        await client.post('/tasks', data);
      }
      setIsModalOpen(false);
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error('Failed to save task', err);
      alert('Error saving task. Please try again.');
    }
  };

  const handleConfirmDelete = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (taskToDelete) {
      try {
        await client.delete(`/tasks/${taskToDelete}`);
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
        fetchTasks(); // Refresh list
      } catch (err) {
        console.error('Delete failed', err);
        alert('Could not delete task.');
      }
    }
  };

  const handleLogout = () => {
    // Manually clear tokens and redirect
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="container">
      {/* HEADER SECTION */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
          {currentDate}
        </div>
        
        <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>Task Manager</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontFamily: 'monospace' }}>
            ID: {userSnippet}
          </span>
          <button className="secondary" onClick={handleLogout} style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
            Exit
          </button>
        </div>
      </header>

      {/* ACTION BAR */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleOpenCreate} style={{ fontSize: '1rem', padding: '10px 25px' }}>
          + New Task
        </button>
      </div>

      {/* TASKS GRID */}
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '50px' }}>
          No tasks found. Create one to get started.
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleOpenEdit} 
              onDelete={handleConfirmDelete} 
            />
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave}
        initialData={editingTask}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--status-overdue)' }}>Delete Task?</h3>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button className="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="danger" onClick={executeDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;