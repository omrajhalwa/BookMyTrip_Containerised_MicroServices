const express = require('express');
const { ServerConfig , Logger , Queue } = require('./config');


const apiRoutes = require('./routes');
const app = express();
const CRON = require('./utils/common/cron-jobs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',apiRoutes);
app.use('/bookingService/api',apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`);
    Logger.info('Successfully started the server','root',{})
    CRON();
   await Queue.connectQueue();
   console.log('Queue connected');
})

