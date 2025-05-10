import fs from 'node:fs/promises'
import express from 'express'
import pg from 'pg'
import cors from 'cors'
const { createHash } = require('crypto');

// Constants
const port = process.env.PORT
const pg_password = process.env.PG_PASSWORD
const pg_user = process.env.PG_USER
const pg_host = process.env.PG_HOST
const pg_port = process.env.PG_PORT || 5432
const pg_database = process.env.PG_DATABASE
const planning_id = process.env.PLANNING_ID

const { Client } = pg

const client = new Client({
password: pg_password,
user: pg_user,
host: pg_host,
port: pg_port,
database: pg_database
})

await client.connect()

// verify if planning_id exists in database
const planningIds = await client.query("select planning_id FROM plannings")
planningIdNotExist = true 
for (var i in planningIds.rows) {
  if (i == planning_id) {
    planningIdNotExist = false
  }
}
if (planningIdNotExist) {
  throw new Error('PlanningId does not exist')
}



// Create http server
const app = express()
app.use(cors())

async fonction IsRequestAuthorized(req) {
  const ReceivedHash = req.get('Authorization')
  const planningPass = await client.query("SELECT planning_password FROM plannings where planning_id = $1", [planning_id]) 
  const computedHash = createHash('sha256').update(`${planning_id}${planningPass.rows[0]}`)
  return ReceivedHash == computedHash
}

app.get('/api/deleteEntry/:id', async (req, res) => { 
  try { 

  const id = req.params.id;
  await client.query("DELETE FROM RegisteredPersons as rp where rp.id = $1", [id]); 
  res.status(200)
  } catch (e) {
  res.status(500)
  console.log(e)}

})

app.get(`/api/${planning_id}/deletePerson`, async (req, res) => {
  try {
    if (!IsRequestAuthorized(req)) {
      return res.status(400).send('The request is not authorized')
    } 
    const name = req.query.name;
    const ma = req.query.morningorafternoon;
    const weekday = req.query.weekday
    const dayNumber = req.query.dayNumber
    if (!name || !ma || !weekday || !dayNumber) {
       return res.status(400).send('Missing required query parameters: name, morningorafternoon, weekday');
    }
    const result = await client.query("DELETE FROM RegisteredPersons as rp where rp.name = $1 and rp.morningorafternoon = $2 and rp.weekday = $3 and rp.dayNumber = $4 RETURNING *", [name, ma, weekday, dayNumber])
    console.log(`Deleted ${result.rowCount} row(s).`)
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (e) {
    res.status(500)
    console.log(e)
  }
})


app.get(`/api/${planning_id}/addPerson`, async (req, res) => {
  if (!IsRequestAuthorized(req)) {
      return res.status(400).send('The request is not authorized')
  }
  const name = req.query.name;
  const ma = req.query.morningorafternoon;
  const weekday = req.query.weekday;
  const dayNumber = req.query.dayNumber
  await client.query("INSERT INTO RegisteredPersons (name, morningorafternoon, weekday, dayNumber) values ($1, $2, $3, $4) RETURNING *", [name, ma, weekday, dayNumber])
  res.status(200).json({ message: 'Person added successfully' });
  })

app.get('/api/getEveryRegisteredPersons', async (req, res) => {
  const response = await client.query("SELECT * FROM RegisteredPersons")
  res.status(200).send(response.rows)
  console.log(response.rows)
})

app.get(`/api/${planning_id}/getRegisteredPersonsHalfDay`, async (req,res) => {
  try {
    if (!IsRequestAuthorized(req)) {
      return res.status(400).send('The request is not authorized')
    }
    const ma = req.query.MorA;
    const weekday = req.query.weekday;
    const dayNumber = req.query.dayNumber
    const response = await client.query("SELECT name FROM RegisteredPersons as rp WHERE rp.morningorafternoon = $1 and rp.weekday = $2 and rp.dayNumber = $3", [ma, weekday, dayNumber]);
    console.log(response.rows)
    res.status(200).send(response.rows)
  } catch (e) {
    res.status(500)
    console.log(e)
  }
})

app.get(`/api/${planning_id}/addActivity`, async (req, res) => {
  if (!IsRequestAuthorized(req)) {
      return res.status(400).send('The request is not authorized')
  }
  const name = req.query.name;
  const halfday = req.query.halfday;
  const dayNumber = req.query.dayNumber
  const day = req.query.day;
  await client.query("INSERT INTO Activities (name, halfday, day, dayNumber) values ($1, $2, $3, $4) RETURNING *", [name, halfday, day, dayNumber])
  res.status(200).json({ message: 'Activity added successfully' });
})

app.get(`/api/${planning_id}/modifyActivity`, async (req, res) => {
  if (!IsRequestAuthorized(req)) {
      return res.status(400).send('The request is not authorized')
  }
  const name = req.query.name;
  const oldname = req.query.oldname;
  const halfday = req.query.halfday;
  const day = req.query.day;
  const dayNumber = req.query.dayNumber
  await client.query("UPDATE Activities SET name = $1 WHERE name = $4 and halfday = $2 AND day = $3 AND dayNumber = $5", [name, halfday, day, oldname, dayNumber])
  res.status(200).json({ message: 'Activity modified successfully' });
})

app.get(`/api/${planning_id}/getActivity`, async (req, res) => {
  try {
    if (!IsRequestAuthorized(req)) {
      return res.status(400).send('The request is not authorized')
    }
    const name = req.query.name;
    const halfday = req.query.halfday;
    const day = req.query.day;
    const dayNumber = req.query.dayNumber
    const response = await client.query("SELECT name FROM Activities WHERE halfday = $1 and day = $2 and dayNumber = $3", [halfday, day, dayNumber]) 
    res.status(200).send(response.rows)
  } catch (e) {
    res.status(500)
    console.log(e) 
  }
})

// Start http server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at http://0.0.0.0:${port}`)
})
