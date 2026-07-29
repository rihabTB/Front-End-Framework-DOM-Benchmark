<script setup>
import { ref, nextTick } from 'vue'

const PRIORITIES = ['Low', 'Medium', 'High']
let idCounter = 0
const nextId = () => ++idCounter
const makeTask = (name, priority) => ({ id: nextId(), name, priority })

const tasks = ref([])
const name = ref('')
const priority = ref('Medium')
const editingId = ref(null)
const editName = ref('')
const editPriority = ref('Medium')
const results = ref([])

function addTask() {
  if (!name.value.trim()) return
  tasks.value.push(makeTask(name.value.trim(), priority.value))
  name.value = ''
}

function removeTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

function startEdit(task) {
  editingId.value = task.id
  editName.value = task.name
  editPriority.value = task.priority
}

function saveEdit(id) {
  const t = tasks.value.find((t) => t.id === id)
  if (t) {
    t.name = editName.value
    t.priority = editPriority.value
  }
  editingId.value = null
}

function logResult(op, n, ms) {
  results.value.push({ op, n, ms: ms.toFixed(2) })
}

async function benchRender(n) {
  const t0 = performance.now()
  tasks.value = Array.from({ length: n }, (_, i) =>
    makeTask(`Task ${i + 1}`, PRIORITIES[i % 3])
  )
  await nextTick()
  const t1 = performance.now()
  logResult(`Render ${n} tasks`, n, t1 - t0)
}

async function benchUpdate(n) {
  const t0 = performance.now()
  for (let i = 0; i < Math.min(n, tasks.value.length); i++) {
    tasks.value[i].name = tasks.value[i].name + ' (updated)'
    tasks.value[i].priority = 'High'
  }
  await nextTick()
  const t1 = performance.now()
  logResult(`Update ${n} tasks`, n, t1 - t0)
}

async function benchDelete(n) {
  const t0 = performance.now()
  tasks.value = tasks.value.slice(n)
  await nextTick()
  const t1 = performance.now()
  logResult(`Delete ${n} tasks`, n, t1 - t0)
}

function clearResults() {
  results.value = []
}
</script>

<template>
  <div class="app">
    <h1>Vue Todo (with Benchmark Harness)</h1>

    <form class="add-form" @submit.prevent="addTask">
      <input placeholder="Task name" v-model="name" />
      <select v-model="priority">
        <option v-for="p in PRIORITIES" :key="p">{{ p }}</option>
      </select>
      <button type="submit">Add</button>
    </form>

    <div class="bench-controls">
      <span>Render:</span>
      <button @click="benchRender(100)">100</button>
      <button @click="benchRender(500)">500</button>
      <button @click="benchRender(1000)">1000</button>
      <span>Update:</span>
      <button @click="benchUpdate(50)">50</button>
      <span>Delete:</span>
      <button @click="benchDelete(50)">50</button>
      <button @click="clearResults">Clear results</button>
    </div>

    <p>Total tasks: {{ tasks.length }}</p>

    <ul class="task-list">
      <li
        v-for="task in tasks.slice(0, 200)"
        :key="task.id"
        class="task"
        :class="`priority-${task.priority.toLowerCase()}`"
      >
        <template v-if="editingId === task.id">
          <input v-model="editName" />
          <select v-model="editPriority">
            <option v-for="p in PRIORITIES" :key="p">{{ p }}</option>
          </select>
          <button @click="saveEdit(task.id)">Save</button>
        </template>
        <template v-else>
          <span>{{ task.name }}</span>
          <span class="badge">{{ task.priority }}</span>
          <button @click="startEdit(task)">Edit</button>
          <button @click="removeTask(task.id)">Delete</button>
        </template>
      </li>
      <li v-if="tasks.length > 200">...and {{ tasks.length - 200 }} more (truncated for display)</li>
    </ul>

    <h2>Benchmark Results</h2>
    <table>
      <thead><tr><th>Operation</th><th>n</th><th>Time (ms)</th></tr></thead>
      <tbody>
        <tr v-for="(r, i) in results" :key="i">
          <td>{{ r.op }}</td><td>{{ r.n }}</td><td>{{ r.ms }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>