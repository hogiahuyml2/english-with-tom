// Máy chủ web English With Tom — phục vụ các trang tĩnh
// Dùng được cả khi chạy local lẫn khi deploy lên Railway
const express = require('express');
const path = require('path');

const app = express();

// Phục vụ toàn bộ file tĩnh (HTML, CSS, JS) trong thư mục này
app.use(express.static(__dirname));

// Trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Railway sẽ cấp cổng qua biến môi trường PORT; chạy local thì dùng 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('English With Tom đang chạy tại cổng ' + port);
});
