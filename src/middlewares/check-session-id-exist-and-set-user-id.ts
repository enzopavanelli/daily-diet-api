import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export interface CustomFastifyRequest extends FastifyRequest {
  userId?: string
}

export async function checkSessionIdExistAndSetUserID(
  req: CustomFastifyRequest,
  res: FastifyReply,
) {
  const sessionId = req.cookies.sessionId

  if (!sessionId) {
    return res.status(401).send({
      error: 'Unauthorized.',
    })
  }

  const [user] = await knex('users').where('session_id', sessionId).select('id')

  if (user === undefined) {
    return res.status(422).send({
      error: 'Unprocessable Content',
    })
  }

  req.userId = user.id

  return req.userId
}
