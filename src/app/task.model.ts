export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    tags: string[];
    status: 'pending' | 'completed';
  }
  