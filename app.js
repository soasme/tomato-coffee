const express = require('express')
const Sequelize = require('sequelize')
const moment = require('moment')
const uuidv4 = require('uuid/v4');
const app = express()
const port = 5000
const sequelize = new Sequelize('sqlite:test.db');
const Tomato = sequelize.define('tomato', {
  id: { type: Sequelize.UUID, primaryKey: true },
  userId: { type: Sequelize.INTEGER },
  description: { type: Sequelize.STRING(2048) },
  startTime: { type: Sequelize.INTEGER },
  endTime: { type: Sequelize.INTEGER },
  createTime: { type: Sequelize.INTEGER },
  updateTime: { type: Sequelize.INTEGER },
  deleteTime: { type: Sequelize.INTEGER },
}, {
  timestamps: false,
  tableName: 'tomatoes',
})

app.use(express.json());

app.get('/', (req, res) => res.send('Pomodoro Technique + Get Things Done + Gist = tomato.coffee'))

app.get("/api/2/tomatoes", (req, res) => {

  Tomato.findAll({
    where: {
      userId: 369081, // @soasme
      // startTime && endTime compare to the date range.
    }
  }).then(tomatoes => {
    res.json(tomatoes)
  }, error => {
    res.status(500).json({ error: 'server internal error.'})
  })
})

app.post("/api/2/tomatoes", (req, res) => {
  const data = req.body
  if (!data.description || !data.startTime || !data.endTime) {
    res.status(400).json({error: 'invalid payload'})
  } else {
    Tomato.create({
      id: uuidv4(),
      userId: 369081,
      description: data.description || "",
      startTime: data.startTime,
      endTime: data.endTime,
      createTime: moment().unix(),
      updateTime: moment().unix(),
    }).then(tomato => {
      res.json(tomato)
    }, error => {
      console.error(error)
      res.status(500).json({ error: 'server internal error.'})
    })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
