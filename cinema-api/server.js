const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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
// --- API 5: LẤY TRẠNG THÁI GHẾ CỦA 1 SUẤT CHIẾU ---
app.get('/api/showtimes/:id/seats', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const showtimeId = req.params.id;

        // Câu lệnh này lấy tất cả ghế của phòng chiếu đó
        // VÀ kiểm tra xem ghế đó đã nằm trong bảng Tickets chưa (để biết đã đặt hay chưa)
        const query = `
            SELECT 
                s.seat_id, s.row_char, s.seat_number, s.type,
                CASE WHEN t.ticket_id IS NOT NULL THEN 1 ELSE 0 END AS is_booked
            FROM Showtimes sh
            JOIN Seats s ON sh.room_id = s.room_id
            LEFT JOIN Bookings b ON b.showtime_id = sh.showtime_id
            LEFT JOIN Tickets t ON t.booking_id = b.booking_id AND t.seat_id = s.seat_id
            WHERE sh.showtime_id = ${showtimeId}
        `;
        
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi lấy ghế');
    }
});

// --- API 6: ĐẶT VÉ (LƯU VÀO DB) ---
app.post('/api/booking', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { user_id, showtime_id, total_amount, seat_ids } = req.body;

        // 1. Tạo đơn booking
        const bookingQuery = `
            INSERT INTO Bookings (user_id, showtime_id, total_amount, status, booking_time)
            OUTPUT INSERTED.booking_id
            VALUES (${user_id}, ${showtime_id}, ${total_amount}, 'confirmed', GETDATE())
        `;
        const bookingResult = await sql.query(bookingQuery);
        const bookingId = bookingResult.recordset[0].booking_id;

        // 2. Tạo vé cho từng ghế (Vòng lặp)
        for (const seatId of seat_ids) {
            await sql.query(`
                INSERT INTO Tickets (booking_id, seat_id)
                VALUES (${bookingId}, ${seatId})
            `);
        }

        res.json({ success: true, message: 'Đặt vé thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi đặt vé');
    }
});
// --- API 7: ĐĂNG KÝ (Register) ---
app.post('/api/register', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { fullName, email, password, phone } = req.body;

        // 1. Kiểm tra xem email đã tồn tại chưa
        const checkUser = await sql.query(`SELECT * FROM Users WHERE email = '${email}'`);
        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
        }

        // 2. Thêm người dùng mới
        // Lưu ý: Dùng N'...' cho tiếng Việt
        const query = `
            INSERT INTO Users (full_name, email, password_hash, phone_number)
            VALUES (N'${fullName}', '${email}', '${password}', '${phone}')
        `;
        await sql.query(query);

        res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký' });
    }
});

// --- API 8: ĐĂNG NHẬP (Login) ---
app.post('/api/login', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { email, password } = req.body;

        // Tìm user theo email và mật khẩu
        const query = `SELECT * FROM Users WHERE email = '${email}' AND password_hash = '${password}'`;
        const result = await sql.query(query);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            // Trả về thông tin user (trừ mật khẩu)
            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                user: {
                    id: user.user_id,
                    name: user.full_name,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu!' });
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