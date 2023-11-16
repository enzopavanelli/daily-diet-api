import fastify from 'fastify'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(usersRoutes, { prefix: 'users' })
