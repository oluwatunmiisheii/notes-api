const request = require('supertest')
const Task = require("../src/models/task.model")
const app = require('../src/app')
const { userOne, setupDatabase, closeDbConnection, taskOne, userTwo } = require('./fixtures/db.fixtures')

beforeEach(setupDatabase)

afterAll(closeDbConnection)

describe("Task", () => {
  describe('Create task -> post -> /api/tasks', () => {
    test("Should not create task if not authenticated", async () => {
      await request(app)
        .post("/api/tasks")
        .send({
          description: "From my test"
        })
        .expect(401)
    })
    test("Should not create task with invalid description", async () => {
      await request(app)
        .post("/api/tasks")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          description: ""
        })
        .expect(422)
    })
    test("Should not create task with invalid completed status", async () => {
      await request(app)
        .post("/api/tasks")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          description: "From my test",
          completed: "invalid"
        })
        .expect(422)
    })
    test("Should create task for user", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send({
          description: "From my test"
        })
        .expect(201)
      
      const task = await Task.findById(response.body.data._id)
      expect(task).not.toBeNull()
      expect(task.completed).toEqual(false)
    })
  })

  describe('Update task -> patch -> /api/tasks/:taskId', () => {
    test("Should not update other users tasks", async () => {
      await request(app)
        .patch(`/api/tasks/${taskOne._id}`)
        .set('Authorization',  `Bearer ${userTwo.tokens[0].token}`)
        .send({
          description: "From my test"
        })
        .expect(404)
    })


    test("Should update task", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskOne._id}`)
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send({
          description: "From my test"
        })
        .expect(200)
      
      const task = await Task.findById(response.body.data._id)
      expect(task.description).toEqual("From my test")
    })
  }) 

  describe('Delete task -> delete -> /api/tasks/:taskId', () => {
    test("Should not delete other users tasks", async () => {
      await request(app)
        .delete(`/api/tasks/${taskOne._id}`)
        .set('Authorization',  `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    })

    test("Should delete task", async () => {
      await request(app)
        .delete(`/api/tasks/${taskOne._id}`)
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      const task = await Task.findById(taskOne._id)
      expect(task).toBeNull()
    })
  })

  describe('Get task -> get -> /api/tasks/:taskId', () => {
    test("Should not get other users tasks", async () => {
      await request(app)
        .get(`/api/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    })

    test("Should not get task with invalid id", async () => {
      await request(app)
        .get(`/api/tasks/123`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(500)
    })

    test("Should get task", async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      expect(response.body.data._id).toEqual(taskOne._id.toString())
    })
  })

  describe('Get tasks -> get -> /api/tasks', () => {
    test("Should not get tasks if not authenticated", async () => {
      await request(app)
        .get("/api/tasks")
        .send()
        .expect(401)
    })

    test("Should get all tasks for user", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      expect(response.body.data.length).toEqual(2)
    })

    test("Should get all tasks for user with completed status", async () => {
      const response = await request(app)
        .get("/api/tasks?completed=true")
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      expect(response.body.data.length).toEqual(1)
    })
    test("Should get all tasks for user with incomplete status", async () => {
      const response = await request(app)
        .get("/api/tasks?completed=false")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      expect(response.body.data.length).toEqual(1)
    })

    test("Should get all tasks for user with limit", async () => {
      const response = await request(app)
        .get("/api/tasks?limit=1")
        .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      expect(response.body.data.length).toEqual(1)
    })

    test('Should fetch page of task', async () => {
      const page = 2
      const response = await request(app)
        .get(`/api/tasks?limit=1&page=${page}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
      
      expect(response.body.data.length).toEqual(1)
      expect(response.body.meta.page).toEqual(page)
    })
  })
})