const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// 使用 body-parser 中间件解析请求体
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

// 連接到MongoDB
mongoose.connect('mongodb+srv://ag076810:V3y8t16g@nvfx.cwu5qws.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// 設定模板引擎
app.set('view engine', 'ejs');

// 使用靜態檔案中介軟體
app.use(express.static('public'));

// 資料庫模型
const Message = mongoose.model('Message', {
  visitorName: String,
  toolNeeded: String,
  toolWebsite: String,
  quantity: Number,
  messageTime: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }, // 新增的字段
});


// 首页路由
app.get('/', async (req, res) => {
  try {
    const messages = await Message.find({ completed: false }).sort({ messageTime: -1 });
    res.render('index', { messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Error fetching messages');
  }
});



// 提交留言路由
app.post('/submit', async (req, res) => {
  console.log('Global submit route triggered');
  const { visitorName, toolNeeded, toolWebsite, quantity } = req.body;

  // 打印这些值
  console.log('Visitor Name:', visitorName);
  console.log('Tool Needed:', toolNeeded);
  console.log('Tool Website:', toolWebsite);
  console.log('Quantity:', quantity);

  // 創建新的留言
  const newMessage = new Message({
    visitorName,
    toolNeeded,
    toolWebsite,
    quantity,
  });

  // 保存到資料庫
  await newMessage.save();
  console.log('Message saved to the database.');

  res.redirect('/');
});

app.post('/approve/:id', async (req, res) => {
  const messageId = req.params.id;
  console.log('messageId:', messageId);

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
    res.status(500).send('Error approving message: ' + error.message); // 修改此行，将错误消息返回给客户端
  }
});

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

  // 刪除留言
  await Message.findByIdAndDelete(messageId);

  res.redirect('/');
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
