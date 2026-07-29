import { useState, useRef } from 'react'

const PRIORITIES = ['Low', 'Medium', 'High']
let idCounter = 0
const nextId = () => ++idCounter

function makeTask(name, priority) {
  return { id: nextId(), name, priority }
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [editingId, setEditingId] = useState(null)
  const [results, setResults] = useState([])
  const renderStart = useRef(null)

  //CRUD 
  const addTask = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setTasks((t) => [...t, makeTask(name.trim(), priority)])
    setName('')
  }

  const removeTask = (id) => setTasks((t) => t.filter((task) => task.id !== id))

  const startEdit = (id) => setEditingId(id)

  const saveEdit = (id, newName, newPriority) => {
    setTasks((t) =>
      t.map((task) =>
        task.id === id ? { ...task, name: newName, priority: newPriority } : task
      )
    )
    setEditingId(null)
  }

  //benchmark helpers 
  const logResult = (op, n, ms) =>
    setResults((r) => [...r, { op, n, ms: ms.toFixed(2) }])

  const benchRender = (n) => {
    const t0 = performance.now()
    const newTasks = Array.from({ length: n }, (_, i) =>
      makeTask(`Task ${i + 1}`, PRIORITIES[i % 3])
    )
    setTasks(newTasks)
    //schedule measurement after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t1 = performance.now()
        logResult(`Render ${n} tasks`, n, t1 - t0)
      })
    })
  }

  const benchUpdate = (n) => {
    const t0 = performance.now()
    setTasks((t) =>
      t.map((task, i) =>
        i < n ? { ...task, name: task.name + ' (updated)', priority: 'High' } : task
      )
    )
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t1 = performance.now()
        logResult(`Update ${n} tasks`, n, t1 - t0)
      })
    })
  }

  const benchDelete = (n) => {
    const t0 = performance.now()
    setTasks((t) => t.slice(n))
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t1 = performance.now()
        logResult(`Delete ${n} tasks`, n, t1 - t0)
      })
    })
  }

  return (
    <div className="app">
      <h1>React Todo (with Benchmark Harness)</h1>

      <form onSubmit={addTask} className="add-form">
        <input
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="bench-controls">
        <span>Render:</span>
        <button onClick={() => benchRender(100)}>100</button>
        <button onClick={() => benchRender(500)}>500</button>
        <button onClick={() => benchRender(1000)}>1000</button>
        <span>Update:</span>
        <button onClick={() => benchUpdate(50)}>50</button>
        <span>Delete:</span>
        <button onClick={() => benchDelete(50)}>50</button>
        <button onClick={() => setResults([])}>Clear results</button>
      </div>

      <p>Total tasks: {tasks.length}</p>

      <ul className="task-list">
        {tasks.slice(0, 200).map((task) =>
          editingId === task.id ? (
            <EditRow key={task.id} task={task} onSave={saveEdit} />
          ) : (
            <li key={task.id} className={`task priority-${task.priority.toLowerCase()}`}>
              <span>{task.name}</span>
              <span className="badge">{task.priority}</span>
              <button onClick={() => startEdit(task.id)}>Edit</button>
              <button onClick={() => removeTask(task.id)}>Delete</button>
            </li>
          )
        )}
        {tasks.length > 200 && <li>...and {tasks.length - 200} more (truncated for display)</li>}
      </ul>

      <h2>Benchmark Results</h2>
      <table>
        <thead>
          <tr><th>Operation</th><th>n</th><th>Time (ms)</th></tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}><td>{r.op}</td><td>{r.n}</td><td>{r.ms}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EditRow({ task, onSave }) {
  const [name, setName] = useState(task.name)
  const [priority, setPriority] = useState(task.priority)
  return (
    <li className="task editing">
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <button onClick={() => onSave(task.id, name, priority)}>Save</button>
    </li>
  )
}