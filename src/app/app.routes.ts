// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskCreateComponent } from './task-create/task-create.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskCreateComponent },
  { path: 'tasks/edit/:id', component: TaskEditComponent },
];
