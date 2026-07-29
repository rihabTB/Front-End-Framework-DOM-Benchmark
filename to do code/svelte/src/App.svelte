<script>
  import { tick } from 'svelte'

  const PRIORITIES = ['Low', 'Medium', 'High']
  let idCounter = 0
  const nextId = () => ++idCounter
  const makeTask = (name, priority) => ({ id: nextId(), name, priority })

  let tasks = []
  let name = ''
  let priority = 'Medium'
  let editingId = null
  let editName = ''
  let editPriority = 'Medium'
  let results = []

  function addTask() {
    if (!name.trim()) return
    tasks = [...tasks, makeTask(name.trim(), priority)]
    name = ''
  }

  function removeTask(id) {
    tasks = tasks.filter((t) => t.id !== id)
  }

  function startEdit(task) {
    editingId = task.id
    editName = task.name
    editPriority = task.priority
  }

  function saveEdit(id) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, name: editName, priority: editPriority } : t
    )
    editingId = null
  }

  function logResult(op, n, ms) {
    results = [...results, { op, n, ms: ms.toFixed(2) }]
  }

  async function benchRender(n) {
    const t0 = performance.now()
    tasks = Array.from({ length: n }, (_, i) =>
      makeTask(`Task ${i + 1}`, PRIORITIES[i % 3])
    )
    await tick()
    const t1 = performance.now()
    logResult(`Render ${n} tasks`, n, t1 - t0)
  }

  async function benchUpdate(n) {
    const t0 = performance.now()
    tasks = tasks.map((t, i) =>
      i < n ? { ...t, name: t.name + ' (updated)', priority: 'High' } : t
    )
    await tick()
    const t1 = performance.now()
    logResult(`Update ${n} tasks`, n, t1 - t0)
  }

  async function benchDelete(n) {
    const t0 = performance.now()
    tasks = tasks.slice(n)
    await tick()
    const t1 = performance.now()
    logResult(`Delete ${n} tasks`, n, t1 - t0)
  }

  function clearResults() {
    results = []
  }

  $: visibleTasks = tasks.slice(0, 200)
</script>

<div class="app">
  <h1>Svelte Todo (with Benchmark Harness)</h1>

  <form class="add-form" on:submit|preventDefault={addTask}>
    <input placeholder="Task name" bind:value={name} />
    <select bind:value={priority}>
      {#each PRIORITIES as p}
        <option>{p}</option>
      {/each}
    </select>
    <button type="submit">Add</button>
  </form>

  <div class="bench-controls">
    <span>Render:</span>
    <button on:click={() => benchRender(100)}>100</button>
    <button on:click={() => benchRender(500)}>500</button>
    <button on:click={() => benchRender(1000)}>1000</button>
    <span>Update:</span>
    <button on:click={() => benchUpdate(50)}>50</button>
    <span>Delete:</span>
    <button on:click={() => benchDelete(50)}>50</button>
    <button on:click={clearResults}>Clear results</button>
  </div>

  <p>Total tasks: {tasks.length}</p>

  <ul class="task-list">
    {#each visibleTasks as task (task.id)}
      <li class="task priority-{task.priority.toLowerCase()}">
        {#if editingId === task.id}
          <input bind:value={editName} />
          <select bind:value={editPriority}>
            {#each PRIORITIES as p}
              <option>{p}</option>
            {/each}
          </select>
          <button on:click={() => saveEdit(task.id)}>Save</button>
        {:else}
          <span>{task.name}</span>
          <span class="badge">{task.priority}</span>
          <button on:click={() => startEdit(task)}>Edit</button>
          <button on:click={() => removeTask(task.id)}>Delete</button>
        {/if}
      </li>
    {/each}
    {#if tasks.length > 200}
      <li>...and {tasks.length - 200} more (truncated for display)</li>
    {/if}
  </ul>

  <h2>Benchmark Results</h2>
  <table>
    <thead><tr><th>Operation</th><th>n</th><th>Time (ms)</th></tr></thead>
    <tbody>
      {#each results as r, i}
        <tr><td>{r.op}</td><td>{r.n}</td><td>{r.ms}</td></tr>
      {/each}
    </tbody>
  </table>
</div>