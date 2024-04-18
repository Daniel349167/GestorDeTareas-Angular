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
      tags: new FormControl('')
    });
    this.tasks$ = this.taskService.getTasks(); // Esto asegura que `tasks$` se inicializa al cargar el componente
  }

  applyFilters(): void {
    const filterValues = this.filterForm.value;
    this.tasks$ = this.taskService.filterTasks(filterValues);
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    // Vuelve a aplicar los filtros después de eliminar una tarea para actualizar la lista
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
      map(tasks => [...tasks].sort((a, b) => (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0)))
    );
  }
}
