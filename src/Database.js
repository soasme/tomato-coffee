import uuidv4 from 'uuid/v4';
import moment from 'moment';

export default class Database {

  syncRemote = async () => {
    const tomatoes = await this.getTomatoes()

    // sync local tomatoes.
    const newTomatoes = await Promise.all(tomatoes.map(async tomato => {
      if (!tomato.createTime) {
        try {
          const res = await fetch("/api/2/tomatoes", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: tomato.description,
              startTime: moment(tomato.startTime).unix(),
              endTime: moment(tomato.endTime).unix(),
            })
          })

          if (res.status !== 200) {
            console.error("sync failed.")
            return tomato
          }

          const newTomato = await res.json()
          if (!newTomato) {
            return tomato // keep it.
          } else {
            return newTomato
          }
        } catch (error) {
          console.error(error)
          return tomato
        }
      } else {
        return tomato
      }
    }))
    window.localStorage.setItem("tomatoes", JSON.stringify(newTomatoes));
    // sync remote tomatoes.
  }

  addTomato = async ({ startTime, endTime, description }) => {
    const tomato = {
      "id": uuidv4(),
      "startTime": startTime,
      "endTime": endTime,
      "description": description,
    }
    const tomatoes = await this.getTomatoes()
    tomatoes.splice(0, 0, tomato);
    window.localStorage.setItem("tomatoes", JSON.stringify(tomatoes));
    this.syncRemote()
    return tomato;
  }

  getTomatoes = async () => {
    return JSON.parse(window.localStorage.getItem("tomatoes") || "[]");
  }

  deleteTomato = async ({ _id }) => {
    //const tomatoes = JSON.parse(window.localStorage.getItem("tomatoes") || "[]");
  }
}
