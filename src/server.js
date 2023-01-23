const app = require('./app')
const port = 3333


app.listen(port, () => {
    console.clear()
    console.log(`Servidor rodando na porta ${port}`)
})