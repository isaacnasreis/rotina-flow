import { db } from './db';
import { Capacitor } from '@capacitor/core';

export async function syncOfflineTasks() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('Offline. Skipping sync.');
    return;
  }

  // 1. Get all tasks that need syncing
  const pendingTasks = await db.tasks
    .where('syncStatus')
    .anyOf(['created', 'updated', 'deleted'])
    .toArray();

  if (pendingTasks.length === 0) return;

  console.log(`Syncing ${pendingTasks.length} tasks...`);

  const API_URL = Capacitor.isNativePlatform() ? "https://rotina-flow.vercel.app" : "";

  for (const task of pendingTasks) {
    try {
      if (task.syncStatus === 'created') {
        // Enviar para a nuvem via API
        await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        
        // Mark as synced locally
        await db.tasks.update(task.id, { syncStatus: 'synced' });
      } 
      else if (task.syncStatus === 'updated') {
        await fetch(`${API_URL}/api/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        
        await db.tasks.update(task.id, { syncStatus: 'synced' });
      } 
      else if (task.syncStatus === 'deleted') {
        await fetch(`${API_URL}/api/tasks/${task.id}`, {
          method: 'DELETE',
        });
        
        // Remove locally after successfully deleting on cloud
        await db.tasks.delete(task.id);
      }
    } catch (error) {
      console.error(`Failed to sync task ${task.id}`, error);
      // It will retry on the next sync cycle
    }
  }
}
