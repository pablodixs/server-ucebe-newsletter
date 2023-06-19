import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

const app = fastify()
const prisma = new PrismaClient()

app.get('/user', async (req, res) => {
  const users = await prisma.user.findMany()

  return res.status(200).send({ users })
})

app.post('/user', async (req: any, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(500)
  }

  try {
    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      return res.status(500).send({ message: 'User already exists' })
    }

    const createUser = await prisma.user.create({
      data: {
        email,
      },
    })

    return res.status(201).send({ createUser })
  } catch (err) {
    return res.status(500).send({ err })
  }
})

app.get('/posts', async (req, res) => {
  const posts = await prisma.news.findMany()

  return res.status(200).send({ posts })
})

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  })
  .then(() => {
    console.log('Server is running on port ' + process.env.PORT)
  })
