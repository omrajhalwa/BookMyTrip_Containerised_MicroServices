const express = require('express');
const { ServerConfig, Logger } = require('./config');
const amqplib = require('amqplib');
const { EmailService } = require('./services')
async function connectQueue() {
  try {

    const connection = await amqplib.connect('amqp://localhost');

    const channel = await connection.createChannel();

    await channel.assertQueue(ServerConfig.RABBITMQ_CHANNEL);

    channel.consume(ServerConfig.RABBITMQ_CHANNEL, async (data) => {
      // console.log(`${Buffer.from(data.content)}`);
      const object = JSON.parse(Buffer.from(data.content));
      await EmailService.sendEmail(ServerConfig.GMAIL_EMAIL, object.recepientEmail, object.subject, object.text);
      channel.ack(data);

    })
  } catch (error) {
    console.log(error);
  }
}

const apiRoutes = require('./routes');

const mailsender = require('./config/email-config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`);
  Logger.info('Successfully started the server', 'root', {});
  await connectQueue();
  console.log('queue is up');
})

