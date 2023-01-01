const connect = require('./config/db.config');
require('dotenv').config();

//catch uncaught
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Server Shutdown...');
  process.exit(1);
});

const app = require('./app');

const PORT = process.env.PORT || 4000;

const server = (async () => {
  try {
    app.listen(PORT, async () => {
      await connect();
      console.log(`Server running at ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
})();


process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(()=>{
    console.log('Server Shutdown....');
    process.exit(1);
  });
});
