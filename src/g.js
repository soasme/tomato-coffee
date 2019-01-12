import moment from 'moment';

class Global {

  loadTimers = async () => {
    const res = await fetch("/v1/timers", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      }
    })
    const todos = await res.json()
    return todos
  }

  loadTodos = async () => {
    const res = await fetch("/v1/tasks", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      }
    })
    const todos = await res.json()
    return todos
  }

  addTodo = async (text) => {
    const res = await fetch("/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      },
      body: JSON.stringify({
        completed: false,
        text: text,
      })
    });
    return res.status === 201
  }

  deleteTodo = async (id) => {
    const res = await fetch("/v1/tasks/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      }
    })
    return res.status === 200
  }

  editTodo = async (id, text) => {
    const res = await fetch("/v1/tasks/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      },
      body: JSON.stringify({
        text: text,
      })
    })
    return res.status === 200
  }

  completeTodo = async (id, completed) => {
    const res = await fetch("/v1/tasks/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      },
      body: JSON.stringify({
        completed: completed,
        completed_at: moment().unix()
      })
    })
    return res.status === 200
  }

  cancleCompleteTodo = async (id) => {
    const res = await fetch("/v1/tasks/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      },
      body: JSON.stringify({
        completed: false
      })
    })
    return res.status === 200
  }

}

const g = new Global();

export default g;