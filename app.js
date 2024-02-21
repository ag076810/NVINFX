const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
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
});

// 首頁路由
app.get('/', async (req, res) => {
  const messages = await Message.find().sort({ messageTime: -1 });
  res.render('index', { messages });
});

// 提交留言路由
app.post('/submit', async (req, res) => {
  console.log('Global submit route triggered');
  const { visitorName, toolNeeded, toolWebsite, quantity } = req.body;

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

// 批准留言路由
app.post('/approve/:id', async (req, res) => {
  const messageId = req.params.id;
  const message = await Message.findById(messageId);

  // 更新狀態為已批准
  message.approved = true;
  await message.save();

  res.redirect('/');
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
