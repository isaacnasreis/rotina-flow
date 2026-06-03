import Dexie, { type EntityTable } from 'dexie';

export type SyncStatus = 'synced' | 'created' | 'updated' | 'deleted';

export interface LocalTask {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isCompleted: boolean;
  category: string;
  blockId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  syncStatus: SyncStatus;
}

export interface LocalBlock {
  id: string;
  name: string;
  order: number;
  userId: string;
  createdAt: Date;
  syncStatus: SyncStatus;
}

const db = new Dexie('RotinaFlowDB') as Dexie & {
  tasks: EntityTable<LocalTask, 'id'>;
  blocks: EntityTable<LocalBlock, 'id'>;
};

// Schema definition - V1 (Original)
db.version(1).stores({
  tasks: 'id, createdAt, userId, isCompleted'
});

// Schema definition - V2 (Added blocks)
db.version(2).stores({
  tasks: 'id, createdAt, userId, isCompleted',
  blocks: 'id, order, userId'
});

// Schema definition - V3 (Added syncStatus)
db.version(3).stores({
  tasks: 'id, createdAt, userId, isCompleted, syncStatus', // Indexed fields
  blocks: 'id, order, userId, syncStatus'
}).upgrade(tx => {
  return tx.table("tasks").toCollection().modify(task => {
    task.syncStatus = task.syncStatus || 'synced';
  });
});

export { db };
