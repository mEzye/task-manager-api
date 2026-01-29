import { useState, useEffect } from 'react';
import {type Task, TaskStatus } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
  initialData?: Task | null; // If present, we are editing
}

export const TaskModal = ({ isOpen, onClose, onSubmit, initialData }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [deadline, setDeadline] = useState('');

  // Reset or pre-fill form when modal opens
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setStatus(initialData.status);
      // Format date for input type="datetime-local" (YYYY-MM-DDTHH:mm)
      const d = initialData.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : '';
      setDeadline(d);
    } else {
      // Clear for new task
      setTitle('');
      setDescription('');
      setStatus(TaskStatus.TODO);
      setDeadline('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit}>
          
          <label>Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            placeholder="Task title..."
          />

          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={4}
            placeholder="Details..."
          />

          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>

          <label>Deadline</label>
          <input 
            type="datetime-local" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};