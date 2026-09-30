import { useEffect, useState } from 'react'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('/api/tasks')

        if (!response.ok) {
          throw new Error('Unable to load tasks.')
        }

        const data = await response.json()
        setTasks(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  if (isLoading) {
    return <p>Loading tasks...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <section>
      <div>
        <h2>Pending</h2>
        {pendingTasks.length === 0 ? (
          <p>No pending tasks.</p>
        ) : (
          <ul>
            {pendingTasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> ({task.priority})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2>Completed</h2>
        {completedTasks.length === 0 ? (
          <p>No completed tasks.</p>
        ) : (
          <ul>
            {completedTasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> ({task.priority})
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default TaskList
