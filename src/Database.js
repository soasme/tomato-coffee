import uuidv4 from 'uuid/v4';
import moment from 'moment';

export default class Database {

  addTomato = async ({ startTime, endTime, description }) => {
    const now = moment();
    const tomato = {
      "_id": uuidv4(),
      "startTime": startTime,
      "endTime": endTime,
      "description": description,
      "createTime": now,
      "updateTime": now
    }
    const tomatoes = await this.getTomatoes()
    tomatoes.splice(0, 0, tomato);
    window.localStorage.setItem("tomatoes", JSON.stringify(tomatoes));
    return tomato;
  }

  getTomatoes = async () => {
    return JSON.parse(window.localStorage.getItem("tomatoes") || "[]");
  }

  deleteTomato = async ({ _id }) => {
    //const tomatoes = JSON.parse(window.localStorage.getItem("tomatoes") || "[]");
  }
}
