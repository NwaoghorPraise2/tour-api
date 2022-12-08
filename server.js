const mongoose = require('mongoose');
require ('dotenv').config;
const app = require('./app');
const PORT = process.env.PORT || 4000;

const DB = process.env.DATABASE

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then (con => {
    console.log(con);
    console.log('Success');
});
// console.log(process.env);

( async ()  => {
    try{
        app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
        });
    }catch (error) {
        console.log(error.message);
    }
})();
