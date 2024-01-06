const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
// const mongoose = require('mongoose')
const uri =
  'mongodb://siddanthmanoj:siddanthmanoj@ac-woab2wp-shard-00-00.yurdnnj.mongodb.net:27017,ac-woab2wp-shard-00-01.yurdnnj.mongodb.net:27017,ac-woab2wp-shard-00-02.yurdnnj.mongodb.net:27017/?ssl=true&replicaSet=atlas-xgckfc-shard-0&authSource=admin&retryWrites=true&w=majority'
/*'mongodb+srv://siddanthmanoj:siddanthmanoj@cluster0.yurdnnj.mongodb.net/?retryWrites=true&w=majority'*/

app.use(cors())
app.use(express.json())
app.listen(8000, () => console.log('Backend Server Running'))
app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri)

  const { email, password } = req.body
  const generatedUserId = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return res.status(409).send('User account already exists. Log in')
    }
    const sanitizedEmail = email.toLowerCase()

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    }
    const insertedUser = await users.insertOne(data)
    const token = jwt.sign(insertedUser, sanitizedEmail, { expiresIn: 60 * 24 })
    res.status(201).json({ token, userId: generatedUserId })
  } catch (err) {
    console.log(err)
  }
})

app.post('/login', async (req, res) => {
  const client = new MongoClient(uri)
  const { email, password } = req.body
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const returnedUser = await users.findOne({ email })
    const correctPassword = await bcrypt.compare(
      password,
      returnedUser.hashed_password
    )

    if (returnedUser && correctPassword) {
      const token = jwt.sign(returnedUser, email, { expiresIn: 60 * 24 })
      res.status(201).json({ token, userId: returnedUser.user_id })
    }
    res.status(400).send('Invalid Credentials')
  } catch (err) {
    console.log(err)
  }
})

app.get('/users', async (req, res) => {
  console.log('I am running in users')

  const client = new MongoClient(uri)
  const userIds = JSON.parse(req.query.userIds)
  try {
    console.log('I am running in try/users')

    await client.connect()
    // await mongoose.connect(uri)
    // const db = mongoose.connection
    const database = client.db('app-data')
    const users = database.collection('users')
    // console.log(userIds)

    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ]

    const foundUsers = await users.aggregate(pipeline).toArray()
    // console.log(foundUsers)
    res.send(foundUsers)
    // const returnedUsers = await users.find().toArray()
    // res.send(returnedUsers)
  } finally {
    await client.close()
  }
})

app.put('/user', async (req, res) => {
  console.log('I am put running in user')

  const client = new MongoClient(uri)

  const formData = req.body.formData
  // console.log(formData)
  try {
    console.log('I am put running in try/user')

    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id: formData.user_id }
    // console.log(query)
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_domain: formData.show_domain,
        domain_identity: formData.domain_identity,
        domain_interest: formData.domain_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
      },
    }
    const insertedUser = await users.updateOne(query, updateDocument)
    res.json(insertedUser)
  } finally {
    await client.close()
  }
})

app.get('/user', async (req, res) => {
  console.log('I am get running in user')

  const client = new MongoClient(uri)
  const userId = req.query.userId

  try {
    console.log('I am get running in try/user')

    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const query = { user_id: userId }
    const user = await users.findOne(query)
    res.send(user)
  } finally {
    await client.close()
  }
})

app.get('/specific-users', async (req, res) => {
  console.log('I am running in specific-users')

  const client = new MongoClient(uri)

  const domain = req.query.domain
  const selfUserId = req.query.userId

  try {
    console.log('I am running in try/specific-users')

    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    // const returnedUsers = await users
    //   .find({ domain_identity: { $eq: domain } })
    //   .toArray()
    const query = {
      $and: [
        { domain_identity: { $eq: domain } },
        { user_id: { $ne: selfUserId } },
      ],
    }
    const returnedUsers = await users.find(query).toArray()
    res.send(returnedUsers)
  } finally {
    await client.close()
  }
})

app.put('/addmatch', async (req, res) => {
  console.log('I am running in addmatch')

  const client = new MongoClient(uri)
  const { userId, matchedUserId } = req.body

  try {
    console.log('I am running in try/addmatch')

    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id: userId }
    const updateDocument = {
      $push: { matches: { user_id: matchedUserId } },
    }
    const user = await users.updateOne(query, updateDocument)
    // console.log(user)
    res.send(user)
  } finally {
    await client.close()
  }
})
//THERE MIGHT BE A MAJOR ISSUE WITH FETCHING MESSAGES IN THE BELOW SNIPPET WHICH CAUSES PROGRAM TO BREAK
//ISSUE MAYBE BEEN IDENTIFIED --> GET TRY MESSAGES CONTINUOUSLY EXECUTING
app.get('/messages', async (req, res) => {
  console.log('I am running in messages')
  const client = new MongoClient(uri)
  const { userId, correspondingUserId } = req.query
  // console.log(userId, correspondingUserId)
  try {
    console.log('I am running in try/messages')

    await client.connect()
    const database = client.db('app-data')
    const messages = database.collection('messages')

    const query = { from_UserId: userId, to_UserId: correspondingUserId }
    const foundMessages = await messages.find(query).toArray()
    // console.log(foundMessages)
    res.send(foundMessages)
  } finally {
    await client.close()
  }
})

app.post('/message', async (req, res) => {
  console.log('I am running in /message')
  const client = new MongoClient(uri)
  const message = req.body.message
  console.log(message)
  try {
    console.log('I am running in try/message')
    await client.connect()
    const database = client.db('app-data')
    console.log(database)
    const messages = database.collection('messages')
    console.log(messages)
    const insertedMessage = await messages.insertOne(message)
    console.log(insertedMessage)
    res.send(insertedMessage)
  } finally {
    await client.close()
  }
})
