# Front-End Framework DOM Benchmark: React vs Angular vs Vue vs Svelte

A to-do list app (add / view / update / delete tasks with name + priority)
implemented four times once per framework each with a built in
benchmark harness for measuring render, update, and delete performance.

## Structure

```
todo-benchmark/
├── docs/
│   ├── Benchmark Results.pdf
│   └── Reflection Report.pdf        
└── to do code/
    ├── react/      # Vite + React, components + useState
    ├── angular/    # Angular CLI project, standalone component, ngFor/ngIf/ngModel
    ├── vue/        # Vite + Vue 3, Composition API + reactive refs
    └── svelte/     # Vite + Svelte, compiled reactivity
```

## Running each app

Each subfolder is a standalone project.

```bash
cd "to do code/react"    && npm install && npm run dev
cd "to do code/vue"      && npm install && npm run dev
cd "to do code/svelte"   && npm install && npm run dev
cd "to do code/angular"  && npm install && npm start
```

Each app opens in the browser with:
- A form to add a task (name + priority: Low/Medium/High)
- A list of tasks with inline Edit/Delete
- A row of benchmark buttons: **Render** 100/500/1000, **Update** 50,
  **Delete** 50 — each timed with `performance.now()` and logged to an
  on-screen results table
- Use Chrome DevTools (Performance / Memory tabs) alongside the on-screen
  timings for a deeper look (flame graphs, heap snapshots)
  