// task-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  taskId!: number;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      dueDate: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      tags: new FormControl(''),
      status: new FormControl('')
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = parseInt(idParam, 10);
        this.loadTask();
      }
    });
  }

  loadTask(): void {
    this.taskService.getTaskById(this.taskId).subscribe(task => {
      if (task) {
        // Consider using a custom pipe or method if tags is an array
        const tagsAsString = task.tags.join(', '); // If 'tags' is an array
        this.taskForm.patchValue({ ...task, tags: tagsAsString });
      } else {
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      // Convert tags back to an array if needed
      formValue.tags = formValue.tags.split(',').map((tag: string) => tag.trim());
      this.taskService.updateTask(this.taskId, formValue);
      this.router.navigate(['/tasks']);
    }
  }
}
