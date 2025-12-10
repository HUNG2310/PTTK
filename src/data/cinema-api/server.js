const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());

// --- CẤU HÌNH DATABASE (QUAN TRỌNG) ---
const dbConfig = {
    user: 'sa', 
    password: '123456', // Mật khẩu của bạn
    server: 'localhost', 
    port: 62800, // <--- SỐ NÀY LẤY TỪ HÌNH ẢNH LOG CỦA BẠN
    database: 'cinemaWeb',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// --- API 1: LẤY DANH SÁCH PHIM ---
app.get('/api/movies', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Movies');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi kết nối SQL');
    }
});

// --- API 2: LẤY CHI TIẾT 1 PHIM ---
app.get('/api/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM Movies WHERE movie_id = ${req.params.id}`);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send('Lỗi Server');
    }
});

// --- API 3: LẤY DANH SÁCH RẠP ---
app.get('/api/cinemas', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Thêm dbo. và kiểm tra chính xác tên bảng
        const result = await sql.query('SELECT * FROM dbo.Cinemas'); 
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy rạp:", err); // In lỗi ra console để debug
        res.status(500).send('Lỗi Server');
    }
});

// --- API 4: LẤY DANH SÁCH KHUYẾN MÃI ---
app.get('/api/promotions', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        // Thêm dbo. và bỏ điều kiện WHERE tạm thời để test
        const result = await sql.query("SELECT * FROM dbo.Promotions"); 
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy khuyến mãi:", err); // In lỗi ra console
        res.status(500).send('Lỗi Server');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});