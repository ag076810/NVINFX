const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

mongoose.connect('mongodb+srv://ag076810:V3y8t16g@nvfx.cwu5qws.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');

app.use(express.static('public'));

const Message = mongoose.model('Message', {
  visitorName: String,
  toolNeeded: String,
  toolWebsite: String,
  quantity: Number,
  messageTime: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
});

// 提交留言路由
app.post('/submit', async (req, res) => {
  const { visitorName, toolNeeded, toolWebsite, quantity } = req.body;

  const newMessage = new Message({
    visitorName,
    toolNeeded,
    toolWebsite,
    quantity,
  });

  await newMessage.save();
  console.log('Message saved to the database.');

  res.redirect('/');
});

// 等待批准路由
app.post('/approve/:id', async (req, res) => {
  const messageId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    console.error('Invalid message ID:', messageId);
    return res.status(400).send('Invalid message ID');
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      console.error('Message not found:', messageId);
      return res.status(404).send('Message not found');
    }

    message.approved = true;
    await message.save();

    console.log('Message approved:', messageId);
    res.redirect('/');
  } catch (error) {
    console.error('Error approving message:', error);
    res.status(500).send('Error approving message: ' + error.message);
  }
});

// 完成留言路由
app.post('/complete/:id', async (req, res) => {
  const messageId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    console.error('Invalid message ID:', messageId);
    return res.status(400).send('Invalid message ID');
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      console.error('Message not found:', messageId);
      return res.status(404).send('Message not found');
    }

    message.completed = true;
    await message.save();

    console.log('Message marked as completed:', messageId);
    res.redirect('/');
  } catch (error) {
    console.error('Error completing message:', error);
    res.status(500).send('Error completing message: ' + error.message);
  }
});

// 刪除留言路由
app.post('/delete/:id', async (req, res) => {
  const messageId = req.params.id;

  await Message.findByIdAndDelete(messageId);

  res.redirect('/');
});

// 首页路由，默认显示未完成的留言
app.get('/', async (req, res) => {
  try {
    const pendingMessages = await Message.find({ completed: false }).sort({ messageTime: -1 });

    res.render('index', { messages: pendingMessages, activeTab: 'pending' });
  } catch (error) {
    console.error('Error fetching pending messages:', error);
    res.status(500).send('Error fetching pending messages');
  }
});

// 未完成留言的路由
app.get('/pending', async (req, res) => {
  try {
    const pendingMessages = await Message.find({ completed: false }).sort({ messageTime: -1 });

    res.render('index', { messages: pendingMessages, activeTab: 'pending' });
  } catch (error) {
    console.error('Error fetching pending messages:', error);
    res.status(500).send('Error fetching pending messages');
  }
});

// 已完成留言的路由
app.get('/completed', async (req, res) => {
  try {
    const completedMessages = await Message.find({ completed: true }).sort({ messageTime: -1 });

    res.render('index', { messages: completedMessages, activeTab: 'completed' });
  } catch (error) {
    console.error('Error fetching completed messages:', error);
    res.status(500).send('Error fetching completed messages');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
