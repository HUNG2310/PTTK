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
// --- API 9: LẤY LỊCH CHIẾU CỦA 1 PHIM ---
app.get('/api/movies/:id/showtimes', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const movieId = req.params.id;

        // Lấy suất chiếu + Tên rạp + Tên phòng
        // Chỉ lấy các suất chiếu trong tương lai (start_time > GETDATE())
        const query = `
            SELECT 
                s.showtime_id, s.start_time, s.price,
                r.name as room_name,
                c.name as cinema_name
            FROM Showtimes s
            JOIN Rooms r ON s.room_id = r.room_id
            JOIN Cinemas c ON r.cinema_id = c.cinema_id
            WHERE s.movie_id = ${movieId}
            ORDER BY s.start_time ASC
        `;
        
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi lấy lịch chiếu');
    }
});
// --- API 10: LẤY CHI TIẾT 1 SUẤT CHIẾU (Để hiển thị trang thanh toán) ---
app.get('/api/showtimes/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const query = `
            SELECT s.showtime_id, s.start_time, s.price, 
                   m.title as movie_title, m.poster_url,
                   r.name as room_name, c.name as cinema_name, c.address
            FROM Showtimes s
            JOIN Movies m ON s.movie_id = m.movie_id
            JOIN Rooms r ON s.room_id = r.room_id
            JOIN Cinemas c ON r.cinema_id = c.cinema_id
            WHERE s.showtime_id = ${id}
        `;
        const result = await sql.query(query);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send('Lỗi');
    }
});
// --- API 11: LẤY DANH SÁCH PHIM & SUẤT CHIẾU CỦA 1 RẠP ---
app.get('/api/cinemas/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;

        // 1. Lấy thông tin Rạp
        const cinemaQuery = `SELECT * FROM Cinemas WHERE cinema_id = ${id}`;
        const cinemaRes = await sql.query(cinemaQuery);
        const cinema = cinemaRes.recordset[0];

        if (!cinema) return res.status(404).json({ message: 'Không tìm thấy rạp' });

        // 2. Lấy các phim đang chiếu tại rạp này
        // (Logic: Tìm suất chiếu tương lai tại các phòng thuộc rạp này)
        const moviesQuery = `
            SELECT DISTINCT m.movie_id, m.title, m.poster_url, m.genre, m.duration_minutes
            FROM Showtimes s
            JOIN Rooms r ON s.room_id = r.room_id
            JOIN Movies m ON s.movie_id = m.movie_id
            WHERE r.cinema_id = ${id} AND s.start_time > GETDATE()
        `;
        const moviesRes = await sql.query(moviesQuery);
        
        // Trả về: Thông tin rạp + Danh sách phim
        res.json({ ...cinema, movies: moviesRes.recordset });

    } catch (err) {
        console.log(err);
        res.status(500).send('Lỗi lấy chi tiết rạp');
    }
});
// --- API 12: LẤY CHI TIẾT 1 KHUYẾN MÃI ---
app.get('/api/promotions/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const query = `SELECT * FROM Promotions WHERE promotion_id = ${id}`;
        const result = await sql.query(query);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send('Lỗi');
    }
});
// ... (Các API cũ giữ nguyên)

// --- NHÓM API ADMIN: QUẢN LÝ PHIM ---

// 13. THÊM PHIM MỚI
app.post('/api/admin/movies', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { title, description, duration_minutes, genre, release_date, poster_url, trailer_url, status } = req.body;
        
        const query = `
            INSERT INTO Movies (title, description, duration_minutes, genre, release_date, poster_url, trailer_url, status)
            VALUES (N'${title}', N'${description}', ${duration_minutes}, N'${genre}', '${release_date}', '${poster_url}', '${trailer_url}', '${status}')
        `;
        await sql.query(query);
        res.json({ success: true, message: 'Thêm phim thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// 14. XÓA PHIM
app.delete('/api/admin/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        // Xóa suất chiếu liên quan trước (Ràng buộc khóa ngoại)
        await sql.query(`DELETE FROM Showtimes WHERE movie_id = ${id}`);
        // Xóa phim
        await sql.query(`DELETE FROM Movies WHERE movie_id = ${id}`);
        
        res.json({ success: true, message: 'Xóa phim thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// 15. SỬA PHIM
app.put('/api/admin/movies/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const { title, description, duration_minutes, genre, release_date, poster_url, trailer_url, status } = req.body;

        const query = `
            UPDATE Movies 
            SET title = N'${title}', 
                description = N'${description}', 
                duration_minutes = ${duration_minutes}, 
                genre = N'${genre}', 
                release_date = '${release_date}', 
                poster_url = '${poster_url}', 
                trailer_url = '${trailer_url}', 
                status = '${status}'
            WHERE movie_id = ${id}
        `;
        await sql.query(query);
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});
// --- NHÓM API ADMIN: QUẢN LÝ KHUYẾN MÃI ---

// 16. THÊM KHUYẾN MÃI MỚI
app.post('/api/admin/promotions', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { title, description, discount_percentage, start_date, end_date, image_url } = req.body;
        
        const query = `
            INSERT INTO Promotions (title, description, discount_percentage, start_date, end_date, image_url)
            VALUES (N'${title}', N'${description}', ${discount_percentage || 0}, '${start_date}', '${end_date}', '${image_url}')
        `;
        await sql.query(query);
        res.json({ success: true, message: 'Thêm ưu đãi thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// 17. SỬA KHUYẾN MÃI
app.put('/api/admin/promotions/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        const { title, description, discount_percentage, start_date, end_date, image_url } = req.body;

        const query = `
            UPDATE Promotions 
            SET title = N'${title}', 
                description = N'${description}', 
                discount_percentage = ${discount_percentage || 0}, 
                start_date = '${start_date}', 
                end_date = '${end_date}', 
                image_url = '${image_url}'
            WHERE promotion_id = ${id}
        `;
        await sql.query(query);
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// 18. XÓA KHUYẾN MÃI
app.delete('/api/admin/promotions/:id', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const { id } = req.params;
        await sql.query(`DELETE FROM Promotions WHERE promotion_id = ${id}`);
        res.json({ success: true, message: 'Xóa ưu đãi thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});