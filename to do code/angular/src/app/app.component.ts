import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  name: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface BenchResult {
  op: string;
  n: number;
  ms: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly priorities: Task['priority'][] = ['Low', 'Medium', 'High'];

  private idCounter = 0;
  private nextId(): number {
    return ++this.idCounter;
  }

  tasks: Task[] = [];
  name = '';
  priority: Task['priority'] = 'Medium';
  editingId: number | null = null;
  editName = '';
  editPriority: Task['priority'] = 'Medium';
  results: BenchResult[] = [];

  get visibleTasks(): Task[] {
    return this.tasks.slice(0, 200);
  }

  private makeTask(name: string, priority: Task['priority']): Task {
    return { id: this.nextId(), name, priority };
  }

  addTask(): void {
    if (!this.name.trim()) return;
    this.tasks = [...this.tasks, this.makeTask(this.name.trim(), this.priority)];
    this.name = '';
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  startEdit(task: Task): void {
    this.editingId = task.id;
    this.editName = task.name;
    this.editPriority = task.priority;
  }

  saveEdit(id: number): void {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, name: this.editName, priority: this.editPriority } : t
    );
    this.editingId = null;
  }

  private logResult(op: string, n: number, ms: number): void {
    this.results = [...this.results, { op, n, ms: ms.toFixed(2) }];
  }

  // Angular change detection runs synchronously after the triggering event, the handler completes using zone.js so we measure across a setTimeout(0)
  private afterRender(cb: () => void): void {
    setTimeout(cb, 0);
  }

  benchRender(n: number): void {
    const t0 = performance.now();
    this.tasks = Array.from({ length: n }, (_, i) =>
      this.makeTask(`Task ${i + 1}`, this.priorities[i % 3])
    );
    this.afterRender(() => {
      const t1 = performance.now();
      this.logResult(`Render ${n} tasks`, n, t1 - t0);
    });
  }

  benchUpdate(n: number): void {
    const t0 = performance.now();
    this.tasks = this.tasks.map((t, i) =>
      i < n ? { ...t, name: t.name + ' (updated)', priority: 'High' } : t
    );
    this.afterRender(() => {
      const t1 = performance.now();
      this.logResult(`Update ${n} tasks`, n, t1 - t0);
    });
  }

  benchDelete(n: number): void {
    const t0 = performance.now();
    this.tasks = this.tasks.slice(n);
    this.afterRender(() => {
      const t1 = performance.now();
      this.logResult(`Delete ${n} tasks`, n, t1 - t0);
    });
  }

  clearResults(): void {
    this.results = [];
  }

  trackById(_index: number, task: Task): number {
    return task.id;
  }
}