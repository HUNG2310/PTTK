const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- CẤU HÌNH DATABASE ---
const dbConfig = {
    user: 'sa', 
    password: '123456', 
    server: 'localhost', 
    port: 62800, // Port lấy từ log của bạn
    database: 'cinemaWeb',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// ==========================================
// NHÓM 1: PUBLIC API (KHÔNG CẦN LOGIN)
// ==========================================

// API 1: LẤY DANH SÁCH PHIM
app.get('/api/movies', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Movies');
        res.json(result.recordset);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 2: LẤY CHI TIẾT 1 PHIM
app.get('/api/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM Movies WHERE movie_id = ${req.params.id}`);
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 3: LẤY DANH SÁCH RẠP
app.get('/api/cinemas', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Cinemas'); 
        res.json(result.recordset);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 4: LẤY DANH SÁCH KHUYẾN MÃI
app.get('/api/promotions', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query("SELECT * FROM Promotions"); 
        res.json(result.recordset);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 5: LẤY CHI TIẾT 1 KHUYẾN MÃI
app.get('/api/promotions/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM Promotions WHERE promotion_id = ${req.params.id}`);
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 6: LẤY LỊCH CHIẾU CỦA 1 PHIM
app.get('/api/movies/:id/showtimes', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const query = `
            SELECT s.showtime_id, s.start_time, s.price, r.name as room_name, c.name as cinema_name
            FROM Showtimes s
            JOIN Rooms r ON s.room_id = r.room_id
            JOIN Cinemas c ON r.cinema_id = c.cinema_id
            WHERE s.movie_id = ${req.params.id} AND s.start_time > GETDATE()
            ORDER BY s.start_time ASC
        `;
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 7: LẤY CHI TIẾT 1 SUẤT CHIẾU (Cho trang Checkout)
app.get('/api/showtimes/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const query = `
            SELECT s.showtime_id, s.start_time, s.price, 
                   m.title as movie_title, m.poster_url,
                   r.name as room_name, c.name as cinema_name, c.address
            FROM Showtimes s
            JOIN Movies m ON s.movie_id = m.movie_id
            JOIN Rooms r ON s.room_id = r.room_id
            JOIN Cinemas c ON r.cinema_id = c.cinema_id
            WHERE s.showtime_id = ${req.params.id}
        `;
        const result = await sql.query(query);
        res.json(result.recordset[0]);
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// API 8: LẤY CHI TIẾT RẠP & PHIM ĐANG CHIẾU
app.get('/api/cinemas/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const cinemaRes = await sql.query(`SELECT * FROM Cinemas WHERE cinema_id = ${id}`);
        const cinema = cinemaRes.recordset[0];
        if (!cinema) return res.status(404).json({ message: 'Không tìm thấy rạp' });

        const moviesQuery = `
            SELECT DISTINCT m.movie_id, m.title, m.poster_url, m.genre, m.duration_minutes
            FROM Showtimes s
            JOIN Rooms r ON s.room_id = r.room_id
            JOIN Movies m ON s.movie_id = m.movie_id
            WHERE r.cinema_id = ${id} AND s.start_time > GETDATE()
        `;
        const moviesRes = await sql.query(moviesQuery);
        res.json({ ...cinema, movies: moviesRes.recordset });
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// ==========================================
// NHÓM 2: BOOKING API (QUAN TRỌNG NHẤT)
// ==========================================

// API 9: LẤY DANH SÁCH GHẾ & TRẠNG THÁI (FIX LỖI HIỂN THỊ)
app.get('/api/showtimes/:id/seats', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const showtimeId = req.params.id;

        // 👉 SỬA LỖI QUAN TRỌNG: Dùng EXISTS để kiểm tra vé.
        // Giúp tránh việc 1 ghế hiện ra 2 lần hoặc không đổi màu khi đã đặt.
        const query = `
            SELECT 
                s.seat_id, s.row_char, s.seat_number, s.room_id,
                CASE WHEN EXISTS (
                    SELECT 1 FROM Tickets t
                    JOIN Bookings b ON t.booking_id = b.booking_id
                    WHERE t.seat_id = s.seat_id AND b.showtime_id = ${showtimeId}
                ) THEN 1 ELSE 0 END AS is_booked
            FROM Showtimes st
            JOIN Seats s ON st.room_id = s.room_id
            WHERE st.showtime_id = ${showtimeId}
        `;
        
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy ghế:", err);
        res.status(500).send('Lỗi lấy danh sách ghế');
    }
});

// API 10: ĐẶT VÉ (Transaction)
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

        // 2. Tạo vé cho từng ghế
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

// ==========================================
// NHÓM 3: AUTH API (ĐĂNG KÝ / ĐĂNG NHẬP)
// ==========================================

// API 11: ĐĂNG KÝ
app.post('/api/register', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { fullName, email, password, phone } = req.body;
        const check = await sql.query(`SELECT * FROM Users WHERE email = '${email}'`);
        if (check.recordset.length > 0) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

        await sql.query(`INSERT INTO Users (full_name, email, password_hash, phone_number, role) VALUES (N'${fullName}', '${email}', '${password}', '${phone}', 'customer')`);
        res.json({ success: true, message: 'Đăng ký thành công!' });
    } catch (err) { res.status(500).json({ success: false }); }
});

// API 12: ĐĂNG NHẬP (TRẢ VỀ ROLE ĐỂ PHÂN QUYỀN)
app.post('/api/login', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { email, password } = req.body;
        const query = `SELECT * FROM Users WHERE email = '${email}' AND password_hash = '${password}'`;
        const result = await sql.query(query);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({
                success: true, message: 'Đăng nhập thành công',
                user: { id: user.user_id, name: user.full_name, email: user.email, role: user.role }
            });
        } else { res.status(401).json({ success: false, message: 'Sai thông tin' }); }
    } catch (err) { res.status(500).send('Lỗi Server'); }
});

// ==========================================
// NHÓM 4: ADMIN API (QUẢN TRỊ VIÊN)
// ==========================================

// API 13: QUẢN LÝ PHIM (Thêm/Sửa/Xóa)
app.post('/api/admin/movies', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { title, description, duration_minutes, genre, release_date, poster_url, trailer_url, status } = req.body;
        const query = `INSERT INTO Movies (title, description, duration_minutes, genre, release_date, poster_url, trailer_url, status) VALUES (N'${title}', N'${description}', ${duration_minutes}, N'${genre}', '${release_date}', '${poster_url}', '${trailer_url}', '${status}')`;
        await sql.query(query);
        res.json({ success: true, message: 'Thêm phim thành công!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
});

app.put('/api/admin/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const { title, description, duration_minutes, genre, release_date, poster_url, trailer_url, status } = req.body;
        const query = `UPDATE Movies SET title = N'${title}', description = N'${description}', duration_minutes = ${duration_minutes}, genre = N'${genre}', release_date = '${release_date}', poster_url = '${poster_url}', trailer_url = '${trailer_url}', status = '${status}' WHERE movie_id = ${id}`;
        await sql.query(query);
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
});

app.delete('/api/admin/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        await sql.query(`DELETE FROM Showtimes WHERE movie_id = ${id}`);
        await sql.query(`DELETE FROM Movies WHERE movie_id = ${id}`);
        res.json({ success: true, message: 'Xóa phim thành công!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
});

// API 14: QUẢN LÝ KHUYẾN MÃI
app.post('/api/admin/promotions', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { title, description, discount_percentage, start_date, end_date, image_url } = req.body;
        const query = `INSERT INTO Promotions (title, description, discount_percentage, start_date, end_date, image_url) VALUES (N'${title}', N'${description}', ${discount_percentage || 0}, '${start_date}', '${end_date}', '${image_url}')`;
        await sql.query(query);
        res.json({ success: true, message: 'Thêm ưu đãi thành công!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
});

app.put('/api/admin/promotions/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const { title, description, discount_percentage, start_date, end_date, image_url } = req.body;
        const query = `UPDATE Promotions SET title = N'${title}', description = N'${description}', discount_percentage = ${discount_percentage || 0}, start_date = '${start_date}', end_date = '${end_date}', image_url = '${image_url}' WHERE promotion_id = ${id}`;
        await sql.query(query);
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
});

app.delete('/api/admin/promotions/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        await sql.query(`DELETE FROM Promotions WHERE promotion_id = ${id}`);
        res.json({ success: true, message: 'Xóa ưu đãi thành công!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
});

// API 15: QUẢN LÝ NGƯỜI DÙNG
app.get('/api/admin/users', async (req, res) => {
    try { await sql.connect(dbConfig); const r = await sql.query("SELECT * FROM Users"); res.json(r.recordset); } catch(e){res.status(500).send(e.message)} 
});
app.delete('/api/admin/users/:id', async (req, res) => { 
    try { await sql.connect(dbConfig); await sql.query(`DELETE FROM Users WHERE user_id=${req.params.id}`); res.json({success:true}); } catch(e){res.status(500).send(e.message)} 
});

// API 16: QUẢN LÝ LỊCH CHIẾU
app.get('/api/rooms', async (req, res) => { 
    try { await sql.connect(dbConfig); const r = await sql.query(`SELECT r.room_id, r.name as room_name, c.name as cinema_name FROM Rooms r JOIN Cinemas c ON r.cinema_id=c.cinema_id`); res.json(r.recordset); } catch(e){res.status(500).send(e.message)} 
});
app.get('/api/admin/showtimes', async (req, res) => { 
    try { await sql.connect(dbConfig); const r = await sql.query(`SELECT s.showtime_id, s.start_time, s.price, m.title as movie_title, r.name as room_name, c.name as cinema_name FROM Showtimes s JOIN Movies m ON s.movie_id=m.movie_id JOIN Rooms r ON s.room_id=r.room_id JOIN Cinemas c ON r.cinema_id=c.cinema_id ORDER BY s.start_time DESC`); res.json(r.recordset); } catch(e){res.status(500).send(e.message)}
});
app.post('/api/admin/showtimes', async (req, res) => { 
    try { await sql.connect(dbConfig); const {movie_id, room_id, start_time, price}=req.body; await sql.query(`INSERT INTO Showtimes (movie_id, room_id, start_time, price) VALUES (${movie_id}, ${room_id}, '${start_time}', ${price})`); res.json({success:true}); } catch(e){res.status(500).send(e.message)}
});
app.delete('/api/admin/showtimes/:id', async (req, res) => { 
    try { await sql.connect(dbConfig); await sql.query(`DELETE FROM Showtimes WHERE showtime_id=${req.params.id}`); res.json({success:true}); } catch(e){res.status(500).send(e.message)}
});

// --- KHỞI CHẠY SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});