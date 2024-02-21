const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 設定靜態資源目錄
app.use(express.static('public'));

// 解析 POST 請求的內容
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 連接 MongoDB
mongoose.connect('mongodb+srv://ag076810:V3y8t16g@nvfx.cwu5qws.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定義 MongoDB 的 Schema
const messageSchema = new mongoose.Schema({
  name: String,
  tool: String,
  link: String,
  quantity: Number,
  status: { type: String, default: 'pending' },
  timestamp: { type: Date, default: Date.now },
});

// 定義 Model
const Message = mongoose.model('Message', messageSchema);

app.get('/app.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/app.js');
});


// 處理 POST 請求
app.post('/addMessage', async (req, res) => {
  try {
    const { name, tool, link, quantity } = req.body;

    // 在 MongoDB 中創建一條新留言
    const newMessage = new Message({
      name,
      tool,
      link,
      quantity,
    });

    // 將留言保存到 MongoDB
    await newMessage.save();

    // 回傳成功的 JSON 響應
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding message:', error);
    // 回傳失敗的 JSON 響應
    res.json({ success: false, error: error.message });
  }
});

// 處理 GET 請求，獲取所有留言
app.get('/getMessages', async (req, res) => {
  try {
    // 從 MongoDB 中獲取所有留言
    const messages = await Message.find().sort({ timestamp: -1 });

    // 回傳 JSON 響應
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    // 回傳失敗的 JSON 響應
    res.json({ success: false, error: error.message });
  }
});

// 監聽端口
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
