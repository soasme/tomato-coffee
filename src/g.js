import moment from 'moment';

class Global {

  buildUrl = (url, parameters) => {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }
    return url;
  }

  loadTimers = async ({ startTime, endTime}) => {
    const res = await fetch(this.buildUrl("/v1/timers", {started_at_gte: startTime, ended_at_lte: endTime}), {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.localStorage.getItem("profile")).token.access_token
      }
    })
    const todos = await res.json()
    return todos
  }

  loadTodos = async ({ completed, startTime, endTime }) => {
    let url;
    if (startTime === undefined || endTime === undefined) {
      url = this.buildUrl("/v1/tasks", { completed })
    } else {
      url = this.buildUrl("/v1/tasks", {
        completed,
        completed_at_gte: startTime,
        completed_at_lte: endTime,
      })
    }
    const res = await fetch(url, {
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
