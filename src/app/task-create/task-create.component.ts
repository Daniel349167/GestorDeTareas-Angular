import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule] // Importa ReactiveFormsModule aquí
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(private taskService: TaskService) {
    // El constructor permanece vacío si no estamos inyectando FormBuilder
  }

  ngOnInit(): void {
    // Inicializamos el formulario en ngOnInit
    this.taskForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      dueDate: new FormControl('', Validators.required),
      priority: new FormControl('medium', Validators.required),
      tags: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask = {
        ...this.taskForm.value,
        id: Date.now(), // Simple ID generation
        status: 'pending',
        tags: this.taskForm.value.tags.split(',').map((tag: string) => tag.trim())
      };
      this.taskService.addTask(newTask);
      this.taskForm.reset();
    }
  }
}
