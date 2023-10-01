const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
const app = express()  //app is an instance of express.
const port = 7000

app.use(express.json());  //To use req.body we should use this middleware

//Available routes
app.use('/api/auth', require('./routes/auth')); // Import and use the router
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
  })