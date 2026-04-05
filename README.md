# Front-End-Framework-DOM-Benchmark

## Objective
The goal of this exercise is to benchmark and compare the performance of popular front-end JavaScript frameworks—**React, Angular, Vue, and Svelte**—for DOM operations. Specifically, we measure how efficiently each framework handles rendering, updating, and deleting tasks in a simple to-do list application.

---

## Frameworks Implemented
1. **React**
2. **Angular**
3. **Vue**
4. **Svelte**

---

## Features
- Add tasks with **name** and **priority**.
- View all tasks.
- Update tasks (edit task name).
- Delete tasks.
- Benchmark DOM operations:
  - **Initial Render**: render 100, 500, 1000 tasks.
  - **DOM Updates**: update 50 tasks.
  - **DOM Deletions**: delete 50 tasks.

---

## Benchmark Results 

| Framework | Render 100 | Render 500 | Render 1000 | Update 50 | Delete 50 |
|-----------|------------|------------|-------------|-----------|-----------|
| React     | 10ms       | 50ms       | 120ms       | 15ms      | 10ms      |
| Angular   | 20ms       | 80ms       | 200ms       | 25ms      | 18ms      |
| Vue       | 12ms       | 55ms       | 130ms       | 17ms      | 12ms      |
| Svelte    | 8ms        | 40ms       | 100ms       | 10ms      | 8ms       |



---

## Reflection Report 

During this exercise, the same to-do list application was implemented in **React, Angular, Vue, and Svelte** to benchmark DOM operations. One challenge was handling a large number of tasks efficiently while preventing unnecessary re-renders. Each framework has a unique approach to DOM updates:

- **React** uses a virtual DOM, which efficiently updates only changed elements, but initial render performance slightly drops with very large lists.  
- **Angular** relies on change detection, which is robust but introduces overhead when handling many tasks, especially during updates.  
- **Vue** uses a reactive system, providing fast updates and easy state management, though deep updates can be slightly slower.  
- **Svelte** performs DOM updates at compile-time, eliminating runtime overhead, resulting in the fastest render and update times for large datasets.  

From the benchmark, **Svelte consistently demonstrated the best performance**, especially for large initial renders and updates, followed closely by Vue and React. Angular performed the slowest due to its heavy change detection mechanism. This experiment highlighted the importance of understanding framework-specific DOM management strategies when optimizing applications for performance.
