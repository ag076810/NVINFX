// 引入相依套件
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 連接 MongoDB，注意將 <your-username>、<your-password>、<your-database> 替換為實際的資訊
mongoose.connect('mongodb+srv://ag076810:V3y8t16g@nvfx.cwu5qws.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// 定義 Message 資料模型
const Message = mongoose.model('Message', {
    name: String,
    tool: String,
    link: String,
    quantity: Number,
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' }, // 初始狀態為待批准
});

// 建立 express app
const app = express();

// 使用 body-parser 中間件處理 JSON 資料
app.use(bodyParser.json());

// 靜態檔案 (CSS) 放在 public 資料夾下
app.use(express.static('public'));

// 處理首頁的 GET 請求
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 處理 POST 請求，新增留言
app.post('/addMessage', async (req, res) => {
    try {
        const { name, tool, link, quantity } = req.body;
        const message = new Message({ name, tool, link, quantity });
        await message.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding message:', error);
        res.json({ success: false });
    }
});

// 處理 GET 請求，取得留言列表
app.get('/getMessages', async (req, res) => {
    try {
        const messages = await Message.find({ status: 'approved' }).sort({ timestamp: -1 }); // 只取得已批准的留言，並按時間降冪排序
        res.json({ messages });
    } catch (error) {
        console.error('Error getting messages:', error);
        res.json({ messages: [] });
    }
});

// 其他路由邏輯...

// 監聽 3000 port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

