import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filterForm!: FormGroup;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      title: new FormControl(''),
      priority: new FormControl(''),
      dueDate: new FormControl(''),
      tags: new FormControl(''),
      status: new FormControl('')
    });
    this.tasks$ = this.taskService.getTasks();
  }

  applyFilters(): void {
    const filterValues = this.filterForm.value;
    this.tasks$ = this.taskService.filterTasks(filterValues);
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.applyFilters(); 
  }

  completeTask(id: number): void {
    this.taskService.completeTask(id);
    this.applyFilters();
  }

  sortByDueDate(): void {
    this.tasks$ = this.tasks$.pipe(
      map(tasks => [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()))
    );
  }

  sortByPriority(): void {
    const priorityOrder: { [key: string]: number } = { 'high': 1, 'medium': 2, 'low': 3 };
  
    this.tasks$ = this.tasks$.pipe(
      map(tasks => [...tasks].sort((a, b) => {
        // Ordenar primero por estado y luego por prioridad
        if (a.status === 'completed' && b.status !== 'completed') {
          return 1; // a va después de b
        } else if (a.status !== 'completed' && b.status === 'completed') {
          return -1; // a va antes que b
        } else {
          return (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0);
        }
      }))
    );
  }
  
}
