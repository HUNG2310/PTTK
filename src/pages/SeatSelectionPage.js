// src/pages/SeatSelectionPage.js
import React, { useState } from 'react'; // Import useState để quản lý state
import { Link, useNavigate } from 'react-router-dom'; // Dùng Link và useNavigate

// ĐỊNH NGHĨA GIÁ VÉ
const TICKET_PRICE = 75000;

// DỮ LIỆU GHẾ (Trong ứng dụng thật, bạn sẽ 'fetch' cái này từ API)
// Chúng ta định nghĩa dữ liệu tĩnh để render
const seatLayout = {
  A: { seats: [1, 2, 3, 4, 5, 6, 7, 8], occupied: [3, 4], spacerAfter: 4 },
  B: { seats: [1, 2, 3, 4, 5, 6, 7, 8], occupied: [], spacerAfter: 4 },
  C: { seats: [1, 2, 3, 4, 5, 6, 7, 8], occupied: [1, 2, 8], spacerAfter: 4 },
  D: { seats: [1, 2, 3, 4, 5, 6, 7, 8], occupied: [5], spacerAfter: 4 },
};

function SeatSelectionPage() {
  
  // --- STATE ---
  // Dùng 'useState' để theo dõi các ghế đang được chọn
  // Khởi tạo với 2 ghế 'B6', 'B7' như trong file HTML
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // useNavigate hook để chuyển trang khi bấm "Tiếp tục"
  const navigate = useNavigate();

  // --- HÀM XỬ LÝ SỰ KIỆN ---
  const handleSeatClick = (seatName) => {
    // Kiểm tra xem ghế đã được chọn chưa
    if (selectedSeats.includes(seatName)) {
      // Nếu đã chọn -> Bỏ chọn (tạo mảng mới loại bỏ ghế này)
      setSelectedSeats(selectedSeats.filter(s => s !== seatName));
    } else {
      // Nếu chưa chọn -> Thêm vào (tạo mảng mới với ghế này)
      setSelectedSeats([...selectedSeats, seatName]);
    }
  };

  // --- HÀM TÍNH TOÁN ---
  // Tính tổng tiền dựa trên số lượng ghế đã chọn
  const totalPrice = selectedSeats.length * TICKET_PRICE;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển sang trang checkout
    // (Trong tương lai, bạn có thể lưu 'selectedSeats' vào đâu đó
    // trước khi chuyển trang, ví dụ: Context hoặc LocalStorage)
    navigate('/booking/checkout');
  };

  return (
    <div className="bg-light">
      
      {/* --- THANH NAV ĐƠN GIẢN --- */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/"><h4>Cinema Web</h4></Link>
        </div>
      </nav>

      {/* --- THANH TIẾN TRÌNH ĐẶT VÉ (BƯỚC 2) --- */}
      <div className="booking-progress-bar">
        <div className="container">
          <div className="row">
            <div className="step completed">
              <div className="step-content">
                <div className="step-number"><i className="fas fa-check"></i></div>
                <div className="step-label">Chọn Suất</div>
              </div>
            </div>
            <div className="step active">
              <div className="step-content">
                <div className="step-number">2</div>
                <div className="step-label">Chọn Ghế</div>
              </div>
            </div>
            <div className="step">
              <div className="step-content">
                <div className="step-number">3</div>
                <div className="step-label">Thanh Toán</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NỘI DUNG CHỌN GHẾ --- */}
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="seat-plan-wrapper">
              <h3 className="text-center">Phòng chiếu 01</h3>
              <div className="screen">MÀN HÌNH</div>
              
              {/* --- VẼ SƠ ĐỒ GHẾ ĐỘNG TỪ STATE --- */}
              <div className="seat-map">
                {Object.keys(seatLayout).map(rowLabel => (
                  <div className="seat-row" key={rowLabel}>
                    <div className="seat-label">{rowLabel}</div>
                    
                    {seatLayout[rowLabel].seats.map(seatNum => {
                      const seatName = `${rowLabel}${seatNum}`;
                      const isOccupied = seatLayout[rowLabel].occupied.includes(seatNum);
                      const isSelected = selectedSeats.includes(seatName);

                      // Tính toán className động
                      let seatClass = 'seat';
                      if (isOccupied) seatClass += ' occupied';
                      if (isSelected) seatClass += ' selected';

                      // Trả về JSX cho ghế
                      // Dùng React.Fragment để bọc ghế và spacer (nếu có)
                      return (
                        <React.Fragment key={seatName}>
                          <div
                            className={seatClass}
                            // Chỉ cho phép click nếu không 'occupied'
                            onClick={() => !isOccupied && handleSeatClick(seatName)}
                          >
                            {seatNum}
                          </div>
                          
                          {/* Thêm spacer sau ghế được chỉ định */}
                          {seatLayout[rowLabel].spacerAfter === seatNum && (
                            <div className="seat-spacer"></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <div className="legend-item"><div className="seat"></div><span>Trống</span></div>
                <div className="legend-item"><div className="seat selected"></div><span>Đang chọn</span></div>
                <div className="legend-item"><div className="seat occupied"></div><span>Đã bán</span></div>
              </div>
            </div>
          </div>

          {/* --- CỘT TÓM TẮT ĐƠN HÀNG (ĐỘNG) --- */}
          <div className="col-lg-4">
            <div className="booking-summary card">
              <img 
                src={process.env.PUBLIC_URL + "/assets/img/aven2018063_cover_0.jpg"} 
                className="card-img-top"
                alt="Poster phim" 
              />
              <div className="card-body">
                <h4 className="card-title">AVENGER 2: ĐẾ CHẾ ULTRON</h4>
                <p className="mb-1"><i className="fas fa-map-marker-alt me-2"></i>GEMINI CINEMAS HÀ TĨNH</p>
                <p><i className="fas fa-calendar-alt me-2"></i>Thứ Năm, 09/10/2025 - 19:00</p>
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <span>Ghế đang chọn:</span>
                  {/* Hiển thị các ghế đã chọn từ state */}
                  <span id="selected-seats" className="fw-bold">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn ghế'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span>Tạm tính:</span>
                  {/* Hiển thị tổng tiền từ state */}
                  <h5 id="total-price" className="text-primary fw-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </h5>
                </div>
                
                {/* Dùng Form để bao bọc nút, xử lý bằng onSubmit */}
                <form onSubmit={handleSubmit}>
                  <div className="d-grid mt-4">
                    {/* Nút này sẽ submit form và gọi hàm handleSubmit */}
                    <button type="submit" className="btn btn-primary btn-lg">
                      TIẾP TỤC
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;