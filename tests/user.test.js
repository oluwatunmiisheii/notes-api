const request = require('supertest')
const app = require('../src/app')
const User = require("../src/models/user.model")
const { userOne, setupDatabase, closeDbConnection } = require('./fixtures/db.fixtures')

beforeEach(setupDatabase)

afterAll(closeDbConnection)


describe("User", () => {
  describe('Get user profile -> get -> /api/users/me', ()  => {
    test("should get profile for user", async () => {
      await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    })
    
    test("should not get profile for unauthenticated user", async () => {
      await request(app)
        .get('/api/users/me')
        .send()
        .expect(401)
    })
  })

  describe('Delete user account -> delete -> /api/users/me', () => {
    test("should delete account for user", async () => {
      await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
  
      const user = await User.findById(userOne.id)
      expect(user).toBeNull()
    })
  
    test("should not delete account for unauthenticated user", async () => {
      await request(app)
        .delete('/api/users/me')
        .send()
        .expect(401)
    })
  })

  describe('Upload user avatar -> put -> /api/users/me/avatar', () => {
    test("should upload avatar image", async () => {
      await request(app)
        .put('/api/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
        const user = await User.findById(userOne._id)
        expect(user.avatar).toEqual(expect.any(Buffer))
    })
  })

  describe('Update user profile -> put -> /api/users/me', () => {
    test("should not update profile for unauthenticated user", async () => {
      await request(app)
        .patch('/api/users/me')
        .send({
          name: "Adenuga"
        })
        .expect(401)
    })
    test("should update valid user fields", async () => {
      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          name: "Adenuga"
        })
        .expect(200)
      
      const user = await User.findById(userOne._id)
  
      expect(user.name).toEqual("Adenuga")
    })
    test("should not update invalid user fields", async () => {
      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          location: "Lagos"
        })
        .expect(400)
    })
  
    test("should not update user with invalid email field", async () => {
      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          email: "adenuga"
        })
        .expect(400)
    })

    test("should not update user with invalid password field", async () => {
      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          password: 1234
        })
        .expect(400)
    })

    test("should not update user with invalid name field", async () => {
      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          name: ''
        })
        .expect(400)
    })      
  })
})
