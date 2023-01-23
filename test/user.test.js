const app = require("../src/app")
const supertest = require("supertest")
const req = supertest(app)
const mongoose = require("mongoose")

const mainUser = {
    name: "Filipe",
    email: "filipe@gmail.com",
    password: "12345"
}

beforeAll(async () => {
    await req.post("/user").send(mainUser)
})
afterAll(async () => {
    await req.delete(`/user/${mainUser.email}`)
    await mongoose.connection.close()
})

describe("Cadastro de usuario", () => {
    test("Deve cadastrar um usuario com sucesso retornando status 201", async () => {
        const email = `${Date.now()}@gmail.com`
        const user = {
            name: "Teste mesmo email", email, password: '1234'
        }
        const res = await req.post("/user").send(user)
        expect(res.statusCode).toBe(201)
        expect(res.body.email).toBe(email)
        await req.delete(`/user/${user.email}`)
    })

    test("Deve impedir que um usuario se cadastre com dados vazios", async () => {
        const user = {
            name: "", email: "", password: ""
        }
        const res = await req.post("/user").send(user)
        expect(res.statusCode).toBe(400)
    })
    test("Deve impedir que um usuario se cadastre com um e-mail repetido", async () => {
        const res = await req.post("/user").send(mainUser)
        expect(res.statusCode).toBe(400)
    })
})

describe("Autenticação", () => {
    test("Deve retornar um token quando logar", async () => {
        const res = await req.post('/auth').send({ email: mainUser.email, password: mainUser.password })
        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBeDefined()
    })
    test("Deve impedir que um usuario se logue com a senha incorreta", async () => {
        const res = await req.post('/auth').send({ email: mainUser.email, password: "banana" })
        expect(res.statusCode).toBe(401)
    })
    test("Deve impedir que um usuario não cadastrado se logue", async () => {
        const res = await req.post('/auth').send({ email: 'wegwg', password: 'wggwegwe' })
        expect(res.statusCode).toBe(401)
    })


})