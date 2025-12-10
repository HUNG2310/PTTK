import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TICKET_PRICE = 75000;
const SHOWTIME_ID = 1; // (Vẫn tạm fix cứng, sau này sẽ lấy từ URL params)

function SeatSelectionPage() {
  const [seatsData, setSeatsData] = useState({}); // Dữ liệu ghế theo hàng
  const [selectedSeatIds, setSelectedSeatIds] = useState([]); // ID các ghế đang chọn
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. LẤY THÔNG TIN USER TỪ LOCAL STORAGE ---
  const storedUser = JSON.parse(localStorage.getItem('currentUser'));

  // --- 2. KIỂM TRA ĐĂNG NHẬP & TẢI GHẾ ---
  useEffect(() => {
    // Nếu chưa đăng nhập -> Chuyển về trang Login
    if (!storedUser) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate('/login');
      return;
    }

    // Tải sơ đồ ghế từ API
    fetch(`http://localhost:5000/api/showtimes/${SHOWTIME_ID}/seats`)
      .then(res => res.json())
      .then(data => {
        // Gom nhóm ghế theo hàng (Row A, Row B...)
        const groupedSeats = {};
        data.forEach(seat => {
          if (!groupedSeats[seat.row_char]) {
            groupedSeats[seat.row_char] = [];
          }
          groupedSeats[seat.row_char].push(seat);
        });
        setSeatsData(groupedSeats);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải ghế:", err);
        setLoading(false);
      });
  }, [navigate, storedUser]); // Thêm dependencies để React theo dõi

  // --- 3. XỬ LÝ KHI BẤM VÀO GHẾ ---
  const handleSeatClick = (seat) => {
    if (seat.is_booked) return; // Nếu ghế đã bán (màu đen) thì không làm gì

    if (selectedSeatIds.includes(seat.seat_id)) {
      // Bỏ chọn
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seat.seat_id));
    } else {
      // Chọn mới
      setSelectedSeatIds([...selectedSeatIds, seat.seat_id]);
    }
  };

  // --- 4. XỬ LÝ ĐẶT VÉ (GỬI VỀ SERVER) ---
  const handleBooking = async () => {
    if (!storedUser) {
      alert("Vui lòng đăng nhập lại!");
      navigate('/login');
      return;
    }

    if (selectedSeatIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }

    const bookingData = {
      user_id: storedUser.id, // <--- DÙNG ID THẬT TỪ USER ĐÃ ĐĂNG NHẬP
      showtime_id: SHOWTIME_ID,
      total_amount: selectedSeatIds.length * TICKET_PRICE,
      seat_ids: selectedSeatIds
    };

    try {
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      if (result.success) {
        alert("Đặt vé thành công!");
        navigate('/'); // Quay về trang chủ
      } else {
        alert("Lỗi: " + (result.message || "Có lỗi xảy ra."));
      }
    } catch (error) {
      console.error("Lỗi đặt vé:", error);
      alert("Lỗi kết nối server.");
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải sơ đồ ghế...</div>;

  return (
    <div className="bg-light" style={{minHeight: '100vh', paddingBottom: '50px'}}>
      {/* Navbar đơn giản */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container"><Link className="navbar-brand" to="/"><h4>Cinema Web</h4></Link></div>
      </nav>

      {/* Thanh tiến trình */}
      <div className="booking-progress-bar">
         <div className="container">
             <div className="row text-center">
                 <div className="col step active">2. Chọn Ghế</div>
             </div>
         </div>
      </div>

      <div className="container my-5">
        <div className="row">
          {/* Cột trái: Sơ đồ ghế */}
          <div className="col-lg-8">
            <div className="seat-plan-wrapper bg-white p-4 rounded shadow-sm text-center">
              <h3>Phòng chiếu 01</h3>
              <div className="screen bg-dark text-white p-2 mb-4 mx-auto" style={{maxWidth: '80%'}}>MÀN HÌNH</div>
              
              <div className="seat-map">
                {Object.keys(seatsData).map(row => (
                  <div className="seat-row d-flex justify-content-center mb-2" key={row}>
                    <div className="seat-label fw-bold me-3" style={{width: '20px'}}>{row}</div>
                    {seatsData[row].map(seat => {
                      // Logic màu sắc ghế
                      let seatClass = "seat btn m-1 ";
                      if (seat.is_booked) {
                        seatClass += "btn-secondary disabled"; // Ghế đã bán (Màu xám/đen)
                      } else if (selectedSeatIds.includes(seat.seat_id)) {
                        seatClass += "btn-warning"; // Ghế đang chọn (Màu vàng)
                      } else {
                        seatClass += "btn-outline-secondary"; // Ghế trống
                      }

                      return (
                        <button 
                          key={seat.seat_id} 
                          className={seatClass}
                          style={{width: '40px', height: '40px'}}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.is_booked}
                        >
                          {seat.seat_number}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              {/* Chú thích */}
              <div className="mt-4 d-flex justify-content-center gap-3">
                 <div><span className="badge bg-secondary p-2 me-1"> </span> Đã bán</div>
                 <div><span className="badge bg-warning p-2 me-1"> </span> Đang chọn</div>
                 <div><span className="badge border border-secondary text-secondary p-2 me-1"> </span> Trống</div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin & Nút Đặt */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
               <div className="card-body">
                   <h5 className="card-title">Thông tin đặt vé</h5>
                   <p className="text-muted mb-1">Khách hàng: <strong>{storedUser ? storedUser.name : 'Khách'}</strong></p>
                   <hr/>
                   <h4>Tổng tiền</h4>
                   <h2 className="text-primary">
                     {(selectedSeatIds.length * TICKET_PRICE).toLocaleString()} đ
                   </h2>
                   <hr/>
                   <p>Ghế đã chọn: <b>{selectedSeatIds.length}</b></p>
                   <button onClick={handleBooking} className="btn btn-primary w-100 btn-lg">
                       XÁC NHẬN ĐẶT VÉ
                   </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;