import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { type Task } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';

/**
 * User Profile Interface
 */
interface UserProfile {
  id: number;
  email: string;
  name?: string;
}

/**
 * TasksPage Component
 * -------------------
 * Main dashboard for the user.
 * Displays tasks and handles CRUD operations.
 */
const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  /** 
   * State for the current user's profile data.
   * This will be populated by the GET /api/users/me endpoint.
   */
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // UI State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const currentDate = new Date().toLocaleDateString('uk-UA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  // --- Effects ---

  useEffect(() => {
    // Initial data load on component mount
    fetchTasks();
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches the current user's profile information from the backend.
   * Target endpoint: GET /api/users/me
   */
  const fetchUserProfile = async () => {
    try {
      const res = await client.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile. Ensure the endpoint GET /api/users/me is implemented.', err);
      // Fail silently for UI, Axios interceptor will handle 401 Unauthorized if needed
    }
  };

  /**
   * Fetch all tasks owned by the current user.
   */
  const fetchTasks = async () => {
    try {
      const res = await client.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
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
      fetchTasks();
    } catch (err) {
      console.error('Failed to save task', err);
      alert('Error saving task.');
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
        fetchTasks();
      } catch (err) {
        console.error('Delete failed', err);
        alert('Could not delete task.');
      }
    }
  };

  const handleLogout = () => {
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
          {/* 
            DYNAMIC USER INFO:
            Displays the name fetched from the server. Falls back to a generic label if still loading.
          */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>
              {user?.name || 'Welcome!'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {user?.email || 'Syncing...'}
            </span>
          </div>
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

      {/* MODALS */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave}
        initialData={editingTask}
      />

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