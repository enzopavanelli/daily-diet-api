import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import {
  CustomFastifyRequest,
  checkSessionIdExistAndSetUserID,
} from '../middlewares/check-session-id-exist-and-set-user-id'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExistAndSetUserID)

  app.post('/', async (req: CustomFastifyRequest, res) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDate: z.string(),
      mealTime: z.string(),
      onDiet: z.boolean(),
    })

    const { name, description, mealDate, mealTime, onDiet } =
      createMealBodySchema.parse(req.body)

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      user_id: req.userId,
      meal_date: mealDate,
      meal_time: mealTime,
      on_diet: onDiet,
    })
    return res.status(201).send()
  })

  app.get('/', async (req: CustomFastifyRequest, res) => {
    const meals = await knex('meals').where('user_id', req.userId).select()

    if (!meals) {
      return res.status(404).send({
        error: 'Not Found',
      })
    }

    return { meals }
  })

  app.get('/:id', async (req: CustomFastifyRequest, res) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(req.params)

    const [meal] = await knex('meals').where({
      id,
      user_id: req.userId,
    })

    if (!meal) {
      return res.status(404).send({
        error: 'Not Found',
      })
    }

    return { meal }
  })

  app.put('/:id', async (req: CustomFastifyRequest, res) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(req.params)

    const { sessionId } = req.cookies

    const [user] = await knex('users').where('session_id', sessionId).select()

    const createdAt = user.created_at

    const editMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDate: z.string(),
      mealTime: z.string(),
      onDiet: z.boolean(),
    })

    const { name, description, mealDate, mealTime, onDiet } =
      editMealBodySchema.parse(req.body)

    const meal = await knex('meals')
      .where({
        id,
        user_id: req.userId,
      })
      .first()
      .update({
        name,
        description,
        user_id: req.userId,
        meal_date: mealDate,
        meal_time: mealTime,
        on_diet: onDiet,
        created_at: createdAt,
        update_at: knex.fn.now(),
      })

    if (!meal) {
      return res.status(404).send({
        error: 'Not Found',
      })
    }
  })

  app.delete('/:id', async (req: CustomFastifyRequest, res) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(req.params)

    const meal = await knex('meals')
      .where({
        id,
        user_id: req.userId,
      })
      .first()
      .delete()

    if (!meal) {
      return res.status(404).send({
        error: 'Not Found',
      })
    }
  })
}
