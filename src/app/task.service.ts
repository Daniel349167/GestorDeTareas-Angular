import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from './task.model'; // Asegúrate de que este modelo esté definido correctamente
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private localStorageKey = 'tasks';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialTasks();
    }
  }

  private loadInitialTasks(): void {
    const tasksJSON = localStorage.getItem(this.localStorageKey);
    const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
    this.tasksSubject.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): void {
    if (isPlatformBrowser(this.platformId)) {
      const tasks = this.tasksSubject.value;
      tasks.push(task);
      this.tasksSubject.next(tasks);
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }
  }

  updateTask(id: number, updates: Partial<Task>): void {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.tasksSubject.next(tasks);
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }
  }

  deleteTask(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const tasks = this.tasksSubject.value.filter(task => task.id !== id);
      this.tasksSubject.next(tasks);
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }
  }

  completeTask(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const tasks = this.tasksSubject.value;
      const index = tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks[index].status = 'completed';
        this.tasksSubject.next(tasks);
        localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
      }
    }
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  filterTasks(criteria: { status?: 'pending' | 'completed'; dueDate?: Date; priority?: string; title?: string; tags?: string[] }): Observable<Task[]> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => tasks.filter(task => {
        let matchesCriteria = true;
        if (criteria.status) {
          matchesCriteria &&= task.status === criteria.status;
        }
        if (criteria.dueDate) {
          matchesCriteria &&= task.dueDate <= criteria.dueDate;
        }
        if (criteria.priority) {
          matchesCriteria &&= task.priority === criteria.priority;
        }
        if (criteria.title) {
          matchesCriteria &&= task.title.toLowerCase().includes(criteria.title.toLowerCase());
        }
        if (criteria.tags && task.tags) {
          matchesCriteria &&= task.tags.some(tag => criteria.tags?.includes(tag) ?? false);
        }
        return matchesCriteria;
      }))
    );
  }
}
