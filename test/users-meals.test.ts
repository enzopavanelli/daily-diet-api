import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import { knex } from '../src/database'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

describe('Users Routes', () => {
  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Enzo Pavanelli',
      })
      .expect(201)
  })

  it('should be able to list all users', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const listUsersResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'Enzo Pavanelli',
      }),
    ])
  })
})

describe('Meals Routes', () => {
  it('should be able to create a new meal', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const userId = await knex('users')
      .select('id')
      .where('name', 'Enzo Pavanelli')

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão com arroz',
        description: 'teste descrição',
        mealDate: '22/11/2001',
        mealTime: '14:00',
        onDiet: true,
      })
      .set('Cookie', cookies)
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const userId = await knex('users')
      .select('id')
      .where('name', 'Enzo Pavanelli')

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão com arroz',
        description: 'teste descrição',
        mealDate: '22/11/2001',
        mealTime: '14:00',
        onDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies) // enviando os cookies no cabeçalho da requisição
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Feijão com arroz',
        description: 'teste descrição',
        meal_date: '22/11/2001',
        meal_time: '14:00',
        on_diet: 1,
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const userId = await knex('users')
      .select('id')
      .where('name', 'Enzo Pavanelli')

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão com arroz',
        description: 'teste descrição',
        mealDate: '22/11/2001',
        mealTime: '14:00',
        onDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies) // enviando os cookies no cabeçalho da requisição
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        description: 'teste descrição',
        name: 'Feijão com arroz',
      }),
    )
  })

  it('should be able to edit a specific meal', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const userId = await knex('users')
      .select('id')
      .where('name', 'Enzo Pavanelli')

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão com arroz',
        description: 'teste descrição',
        mealDate: '22/11/2001',
        mealTime: '14:00',
        onDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies) // enviando os cookies no cabeçalho da requisição
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'teste descrição editada',
        mealDate: '23/11/2002',
        mealTime: '11:00',
        onDiet: false,
      })
      .expect(200)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies) // enviando os cookies no cabeçalho da requisição
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Arroz',
        description: 'teste descrição editada',
        meal_date: '23/11/2002',
        meal_time: '11:00',
        on_diet: 0,
      }),
    )
  })

  it('should be able to delete a specific meal', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const userId = await knex('users')
      .select('id')
      .where('name', 'Enzo Pavanelli')

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão com arroz',
        description: 'teste descrição',
        mealDate: '22/11/2001',
        mealTime: '14:00',
        onDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies) // enviando os cookies no cabeçalho da requisição
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should be able to get summary meals', async () => {
    const createUsersResponse = await request(app.server).post('/users').send({
      name: 'Enzo Pavanelli',
    })

    const cookies = createUsersResponse.get('Set-Cookie')

    const userId = await knex('users')
      .select('id')
      .where('name', 'Enzo Pavanelli')

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Arroz',
        description: 'teste descrição',
        mealDate: '22/11/2001',
        mealTime: '14:00',
        onDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão com arroz',
        description: 'teste descrição',
        mealDate: '23/11/2001',
        mealTime: '10:00',
        onDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Feijão ',
        description: 'teste descrição',
        mealDate: '24/11/2001',
        mealTime: '12:00',
        onDiet: false,
      })
      .set('Cookie', cookies)

    const summaryMealsResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies) // enviando os cookies no cabeçalho da requisição
      .expect(200)

    expect(summaryMealsResponse.body.summary).toEqual(
      expect.objectContaining({
        'Total de refeições registradas': 3,
        'Total de refeições dentro da dieta': 2,
        'Total de refeições fora da dieta': 1,
      }),
    )
  })
})
