import { TaskStatus, type Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const getBorderColor = () => {
    if (task.deadline && new Date(task.deadline) < new Date() && task.status !== TaskStatus.DONE) {
      return 'var(--status-overdue)';
    }
    switch (task.status) {
      case TaskStatus.DONE: return 'var(--status-done)';
      case TaskStatus.IN_PROGRESS: return 'var(--status-progress)';
      default: return 'var(--border-color)';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('uk-UA', { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      padding: '1.5rem',
      borderRadius: '8px',
      border: `2px solid ${getBorderColor()}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      position: 'relative',
      minHeight: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', wordBreak: 'break-word' }}>{task.title}</h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button className="icon-btn" onClick={() => onDelete(task.id)} title="Delete" style={{ color: 'var(--status-overdue)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flexGrow: 1, whiteSpace: 'pre-wrap' }}>
        {task.description || 'No description'}
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', width: '100%', margin: '10px 0' }} />

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div><strong>Status:</strong> <span style={{ textTransform: 'uppercase', color: 'var(--text-normal)' }}>{task.status}</span></div>
        <div><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</div>
        <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
          <span>Cr: {formatDate(task.createdAt)}</span>
          <span>Upd: {formatDate(task.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};