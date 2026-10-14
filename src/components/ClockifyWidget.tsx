import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, RotateCw } from 'lucide-react';

interface ClockifyWidgetProps {
  onTriggerPrompt: (prompt: string) => void;
}

export const ClockifyWidget: React.FC<ClockifyWidgetProps> = ({ onTriggerPrompt }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(3840); // 1h 04m demo starting state
  const [taskName, setTaskName] = useState('Antigravity Consumer App UI');

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      onTriggerPrompt(`Use clockify-mcp start_timer to start a timer for "${taskName}"`);
    } else {
      setIsRunning(false);
      onTriggerPrompt('Use clockify-mcp stop_timer to stop the current active timer and summarize logged time');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Clock size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>Clockify Tracker</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>Live MCP Integration</span>
          </div>
        </div>

        <button 
          onClick={() => onTriggerPrompt('Use clockify-mcp to get my current timer status and today\'s detailed report')}
          title="Refresh Clockify Status"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px',
            color: 'var(--text-secondary)'
          }}
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Digital Counter Display */}
      <div 
        className={isRunning ? 'animate-breathe' : ''}
        style={{
          background: 'rgba(7, 9, 14, 0.8)',
          borderRadius: '12px',
          padding: '14px 16px',
          border: `1px solid ${isRunning ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-subtle)'}`,
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease'
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {isRunning ? 'Currently Tracking' : 'Paused / Ready'}
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '1.65rem',
            fontWeight: 700,
            color: isRunning ? 'var(--accent-cyan)' : 'var(--text-main)',
            letterSpacing: '0.05em'
          }}>
            {formatTime(seconds)}
          </div>
        </div>

        <button
          onClick={handleToggleTimer}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: isRunning 
              ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
              : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: isRunning 
              ? '0 0 16px rgba(239, 68, 68, 0.4)' 
              : '0 0 16px rgba(6, 182, 212, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {isRunning ? <Square size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>
      </div>

      {/* Task Description Input */}
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="What are you working on?"
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.8rem',
          color: 'var(--text-main)',
          outline: 'none',
          marginBottom: '10px'
        }}
      />

      {/* Quick Action Chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onTriggerPrompt('Use clockify-mcp log_past_time to log 1 hour for "Client Consultation" today')}
          style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.72rem',
            color: 'var(--accent-cyan)'
          }}
        >
          + Log 1h Consultation
        </button>
        <button
          onClick={() => onTriggerPrompt('Get my Clockify summary report for this week using clockify-mcp')}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)'
          }}
        >
          Weekly Summary
        </button>
      </div>
    </div>
  );
};
