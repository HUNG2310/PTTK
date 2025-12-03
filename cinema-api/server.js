const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors()); // Cho phép React truy cập

// --- CẤU HÌNH DATABASE (SỬA LẠI CHO ĐÚNG MÁY BẠN) ---
const dbConfig = {
    user: 'sa', // Hoặc 'cinema_admin' nếu bạn dùng tài khoản đó
    password: '123456', // Mật khẩu SQL của bạn (nhớ điền đúng nhé)
    server: 'localhost', // Đổi thành localhost
    port: 62800, // <--- ĐÂY LÀ SỐ QUAN TRỌNG NHẤT BẠN VỪA TÌM ĐƯỢC
    database: 'cinemaWeb',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
        // Xóa dòng instanceName đi, chúng ta không cần nó nữa
    }
};
// --- API 1: LẤY DANH SÁCH TẤT CẢ PHIM ---
app.get('/api/movies', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Movies');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi Server');
    }
});

// --- API 2: LẤY CHI TIẾT 1 PHIM ---
app.get('/api/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM Movies WHERE movie_id = ${req.params.id}`);
        if(result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Không tìm thấy phim');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi Server');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});