const mongoose = require('mongoose')
async function connection() {
    mongoose.connect('mongodb://127.0.0.1:27017/pics').catch(err => { console.log(err) })
}
module.exports = connection