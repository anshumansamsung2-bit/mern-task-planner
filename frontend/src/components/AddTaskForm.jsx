import { useState } from 'react'

function AddTaskForm() {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (title.trim() === '') {
      setError('Title cannot be empty.')
      return
    }

    setError('')

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          priority,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to save the task.')
      }

      setTitle('')
      setPriority('Medium')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit">Add task</button>
    </form>
  )
}

export default AddTaskForm
