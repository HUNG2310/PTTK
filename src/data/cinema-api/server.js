const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors()); // Cho phép React truy cập

// --- CẤU HÌNH DATABASE (SỬA LẠI CHO ĐÚNG MÁY BẠN) ---
const dbConfig = {
    user: 'sa', // Hoặc tên tài khoản bạn đã tạo (ví dụ: cinema_admin)
    password: 'Hungle@23102004', // <--- BẠN PHẢI ĐIỀN MẬT KHẨU SQL VÀO ĐÂY
    server: 'HUNG\\MSSQLSERVER02', // <--- QUAN TRỌNG: Phải dùng 2 dấu gạch chéo \\
    database: 'cinemaWeb', // Tên database trong Ảnh 2
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: 'MSSQLSERVER02' // Thêm dòng này để Node.js tìm đúng server
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