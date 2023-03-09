const mongoose = require('mongoose')

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => { console.log("DB connection successful") });


const port = 3000; //process.env.PORT ||
app.listen(port, () => {
    console.log(`app running on port  ${port}....`);
})


