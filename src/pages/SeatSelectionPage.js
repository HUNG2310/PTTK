import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../css/custom-styles.css'; 

const TICKET_PRICE = 75000;

function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const [seatsData, setSeatsData] = useState({});
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('currentUser'));

 // --- 1. TẢI DỮ LIỆU GHẾ (Code gọn nhẹ vì Server đã xử lý tốt) ---
  useEffect(() => {
    if (!storedUser) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5000/api/showtimes/${showtimeId}/seats`)
      .then(res => res.json())
      .then(data => {
        // Không cần filter uniqueSeats nữa, dùng thẳng data
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
  }, [navigate, storedUser, showtimeId]);

  // --- 2. XỬ LÝ CHỌN GHẾ ---
  const handleSeatClick = (seat) => {
    if (seat.is_booked) return;
    
    if (selectedSeatIds.includes(seat.seat_id)) {
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seat.seat_id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.seat_id]);
    }
  };

  // --- 3. XỬ LÝ CHUYỂN TRANG THANH TOÁN ---
  const handleBooking = () => {
    // Kiểm tra đăng nhập
    if (!storedUser) {
      alert("Vui lòng đăng nhập lại!");
      navigate('/login');
      return;
    }
    // Kiểm tra đã chọn ghế chưa
    if (selectedSeatIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }

    // Chuyển sang trang Checkout với dữ liệu
    navigate('/booking/checkout', {
      state: {
        selectedSeatIds: selectedSeatIds,
        totalAmount: selectedSeatIds.length * TICKET_PRICE,
        showtimeId: showtimeId,
        seatsData: seatsData // Truyền sơ đồ ghế sang để hiển thị tên ghế (A1, B2...)
      }
    });
  };

  if (loading) return <div className="text-center text-white mt-5 pt-5">Đang tải sơ đồ ghế...</div>;

  return (
    <div className="bg-dark-section text-white" style={{minHeight: '100vh', paddingBottom: '50px', paddingTop: '80px'}}>
      
      {/* Thanh tiến trình */}
      <div className="booking-progress-bar mb-5">
         <div className="container">
             <div className="row text-center">
                 <div className="col step active fw-bold text-warning">2. CHỌN GHẾ</div>
             </div>
         </div>
      </div>

      <div className="container">
        <div className="row">
          {/* --- CỘT TRÁI: SƠ ĐỒ GHẾ --- */}
          <div className="col-lg-8 mb-4">
            <div className="seat-plan-wrapper bg-dark border border-secondary p-4 rounded shadow-lg text-center">
              <h3 className="text-warning mb-4">Phòng Chiếu 01</h3>
              
              {/* Màn hình */}
              <div className="screen bg-white text-dark p-1 mb-5 mx-auto shadow fw-bold" 
                   style={{maxWidth: '80%', height: '5px', boxShadow: '0 10px 20px rgba(255,255,255,0.2)'}}>
              </div>
              <div className="text-muted small mb-4">MÀN HÌNH</div>
              
              <div className="seat-map">
                {Object.keys(seatsData).map(row => (
                  <div className="seat-row d-flex justify-content-center mb-2" key={row}>
                    <div className="seat-label fw-bold me-3 pt-2 text-warning" style={{width: '20px'}}>{row}</div>
                    {seatsData[row].map(seat => {
                      
                      let seatClass = "seat btn m-1 ";
                      
                      // Style mặc định
                      let seatStyle = { 
                          width: '40px', 
                          height: '40px', 
                          fontSize: '0.8rem', 
                          border: 'none',
                          transition: 'all 0.2s',
                          borderRadius: '4px' 
                      };

                      // 1. GHẾ ĐÃ BÁN (MÀU ĐEN XÁM)
                      if (seat.is_booked) {
                        seatStyle.backgroundColor = "#444"; 
                        seatStyle.color = "#666"; 
                        seatStyle.cursor = "not-allowed";
                      } 
                      // 2. GHẾ ĐANG CHỌN (MÀU VÀNG)
                      else if (selectedSeatIds.includes(seat.seat_id)) {
                        seatStyle.backgroundColor = "#ffc107"; 
                        seatStyle.color = "#000"; 
                        seatStyle.fontWeight = "bold";
                        seatStyle.transform = "scale(1.1)"; 
                        seatStyle.boxShadow = "0 0 10px rgba(255, 193, 7, 0.5)"; 
                      } 
                      // 3. GHẾ TRỐNG (MÀU TRẮNG)
                      else {
                        seatStyle.backgroundColor = "#ffffff"; 
                        seatStyle.color = "#000"; 
                      }

                      return (
                        <button 
                          key={seat.seat_id} 
                          className={seatClass}
                          style={seatStyle}
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
              
              {/* Chú thích màu sắc */}
              <div className="mt-5 d-flex justify-content-center gap-4">
                 <div className="d-flex align-items-center">
                    <span className="d-inline-block me-2" style={{width:20, height:20, backgroundColor: '#444', borderRadius: 4}}></span> 
                    <small>Đã bán</small>
                 </div>
                 <div className="d-flex align-items-center">
                    <span className="d-inline-block me-2" style={{width:20, height:20, backgroundColor: '#ffc107', borderRadius: 4, boxShadow: "0 0 5px #ffc107"}}></span> 
                    <small>Đang chọn</small>
                 </div>
                 <div className="d-flex align-items-center">
                    <span className="d-inline-block me-2" style={{width:20, height:20, backgroundColor: '#ffffff', borderRadius: 4}}></span> 
                    <small>Trống</small>
                 </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: THÔNG TIN VÉ --- */}
          <div className="col-lg-4">
            <div className="card bg-dark border border-warning shadow-lg text-white">
               <div className="card-header bg-transparent border-warning text-center">
                   <h5 className="m-0 text-uppercase text-warning">Thông tin đặt vé</h5>
               </div>
               <div className="card-body">
                   <p className="d-flex justify-content-between">
                       <span className="text-white-50">Khách hàng:</span>
                       <span className="fw-bold">{storedUser ? storedUser.name : 'Khách'}</span>
                   </p>
                   <p className="d-flex justify-content-between">
                       <span className="text-white-50">Phòng chiếu:</span>
                       <span className="fw-bold">Phòng 01</span>
                   </p>
                   <div className="mb-3">
                       <span className="text-white-50">Ghế chọn:</span>
                       <div className="d-flex flex-wrap gap-1 mt-1">
                           {selectedSeatIds.length > 0 ? selectedSeatIds.map(id => {
                               let seatLabel = "";
                               Object.keys(seatsData).forEach(row => {
                                   const found = seatsData[row].find(s => s.seat_id === id);
                                   if(found) seatLabel = `${row}${found.seat_number}`;
                               });
                               return <span key={id} className="badge bg-warning text-dark">{seatLabel}</span>
                           }) : <span className="text-muted small">Chưa chọn ghế</span>}
                       </div>
                   </div>
                   <hr className="border-secondary"/>
                   <div className="d-flex justify-content-between align-items-center mb-4">
                       <span className="h5 mb-0">Tổng tiền:</span>
                       <span className="h3 text-warning mb-0">
                         {(selectedSeatIds.length * TICKET_PRICE).toLocaleString()} đ
                       </span>
                   </div>
                   
                   {/* Nút bấm chuyển sang hàm handleBooking mới */}
                   <button onClick={handleBooking} className="btn btn-warning w-100 btn-lg fw-bold shadow">
                       TIẾP TỤC THANH TOÁN
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