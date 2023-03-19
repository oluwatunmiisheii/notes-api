const request = require('supertest')
const app = require('../src/app')
const User = require("../src/models/user.model")
const { userOne, setupDatabase, closeDbConnection } = require('./fixtures/db.fixtures')

beforeEach(setupDatabase)

afterAll(closeDbConnection)


describe("User", () => {
  test("should signup a new user", async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: "Test",
      email: "test@example.com",
      password: "1234567890"
    }).expect(201)

    const user = await User.findById(response.body.data.user._id)
    
    expect(response.body).toMatchObject({
      data: {
        user: {
          name: "Test",
          email: "test@example.com",
          age: 0
        },
        token: user.tokens[0].token
      }
    })
  })

  test("should not save plain password", async () => {
    const user = await User.findOne({_id: userOne._id})
    expect(user.password).not.toBe("123456789")
  })
  
  test("should login existing user", async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: userOne.email,
      password: userOne.password
    }).expect(200)
    
    const user = await User.findById(userOne._id)

    expect(response.body.data.token).toBe(user.tokens[1].token)
  })
  
  test("should not login nonexistent user", async () => {
    await request(app).post('/api/auth/login').send({
      email: "ooooooo@email.com",
      password: "thisisnotmypass"
    }).expect({
      "message": "Unable to login",
      "success": false
    })
  })
})
