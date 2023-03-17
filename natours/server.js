
const mongoose = require('mongoose')

const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION ! Shutting down...');
    console.log(err.name, err.message)

})

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
const server = app.listen(port, () => {
    console.log(`app running on port  ${port}....`);
})


process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION shutting down....');
    server.close(() => {
        process.exit(1);
    })
})


