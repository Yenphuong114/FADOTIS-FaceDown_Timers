// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Lệnh này giúp gọi file .env ra

const app = express();
app.use(express.json());
app.use(cors());

// Sử dụng link từ file .env (Nhớ đảm bảo .env của bạn có chữ /Fadotis ở cuối link)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123.@cluster0.q5lvirq.mongodb.net/';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Đã kết nối MongoDB Database: Fadotis'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    // Đoạn này để xem điện thoại có gửi dữ liệu tới không
    console.log("🚀 Có yêu cầu Đăng ký gửi tới với dữ liệu:", req.body);

    const { name, password } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    // Đoạn này để xem tại sao MongoDB không chịu lưu
    console.log("❌ CHI TIẾT LỖI LƯU DATABASE:", error); 
    res.status(500).json({ message: 'Lỗi server' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: 'Không tìm thấy người dùng' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

const PORT = process.env.PORT || 3000;
// Thêm '0.0.0.0' để cho phép điện thoại trong mạng LAN truy cập vào
app.listen(PORT, '0.0.0.0', () => console.log(`Server chạy tại http://0.0.0.0:${PORT}`));