const connect = require('./config/db.config');
require ('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 4000;



( async ()  => {
    try{
        app.listen(PORT, () => {
        connect();
        console.log(`Server running at ${PORT}`);
        });
    }catch (error) {
        console.log(error.message);
    }
})();
