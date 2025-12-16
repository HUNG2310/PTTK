import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/custom-styles.css';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(false); // Loading khi bấm thanh toán

  // Lấy dữ liệu được truyền từ trang Chọn Ghế
  const { selectedSeatIds, totalAmount, showtimeId, seatsData } = location.state || {};
  const storedUser = JSON.parse(localStorage.getItem('currentUser'));

  // Nếu người dùng truy cập trực tiếp link mà không qua chọn ghế -> đuổi về
  useEffect(() => {
    if (!location.state) {
      alert("Vui lòng chọn ghế trước!");
      navigate('/');
    }
    // Gọi API lấy thông tin phim để hiển thị
    fetch(`http://localhost:5000/api/showtimes/${showtimeId}`)
      .then(res => res.json())
      .then(data => setShowtime(data))
      .catch(err => console.error(err));
  }, [location.state, navigate, showtimeId]);

  // --- XỬ LÝ THANH TOÁN CUỐI CÙNG ---
  const handleConfirmPayment = async () => {
    setLoading(true);
    const bookingData = {
      user_id: storedUser.id,
      showtime_id: showtimeId,
      total_amount: totalAmount,
      seat_ids: selectedSeatIds
    };

    try {
      // Gọi API đặt vé (Code cũ bên SeatSelection chuyển sang đây)
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      if (result.success) {
        alert("🎉 THANH TOÁN THÀNH CÔNG! Vé đã được gửi tới email.");
        navigate('/'); 
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  if (!showtime) return <div className="text-white text-center mt-5">Đang tải hóa đơn...</div>;

  // Tìm tên ghế để hiển thị (VD: A1, A2)
  const seatLabels = [];
  selectedSeatIds.forEach(id => {
      Object.keys(seatsData).forEach(row => {
          const found = seatsData[row].find(s => s.seat_id === id);
          if(found) seatLabels.push(`${row}${found.seat_number}`);
      });
  });

  return (
    <div className="bg-dark-section text-white" style={{minHeight: '100vh', paddingTop: '100px'}}>
      <div className="container">
        <h2 className="text-warning text-center text-uppercase mb-5">Thanh Toán & Xác Nhận</h2>
        
        <div className="row">
          {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN */}
          <div className="col-lg-7 mb-4">
            <div className="card bg-dark border border-secondary shadow p-4">
                <h4 className="text-white mb-4">Phương thức thanh toán</h4>
                
                {/* Giả lập QR Code */}
                <div className="form-check p-3 border border-warning rounded mb-3" style={{backgroundColor: '#222'}}>
                    <input className="form-check-input ms-2" type="radio" name="payment" defaultChecked />
                    <label className="form-check-label ms-3 fw-bold text-warning">
                        Quét mã QR (Momo / ZaloPay / Ngân hàng)
                    </label>
                    <div className="text-center mt-3 bg-white p-3 rounded" style={{maxWidth: '200px', margin: '0 auto'}}>
                        {/* Ảnh QR mẫu */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="img-fluid" />
                        <p className="text-dark small mt-2 mb-0">Quét để thanh toán</p>
                    </div>
                </div>

                <div className="form-check p-3 border border-secondary rounded opacity-50">
                    <input className="form-check-input ms-2" type="radio" name="payment" disabled />
                    <label className="form-check-label ms-3">Thẻ ATM / Visa / Master (Đang bảo trì)</label>
                </div>
            </div>
          </div>

          {/* CỘT PHẢI: HÓA ĐƠN */}
          <div className="col-lg-5">
            <div className="card bg-dark border border-warning shadow text-white">
                <div className="card-header bg-warning text-dark text-center fw-bold">
                    THÔNG TIN VÉ
                </div>
                <div className="card-body">
                    <h4 className="text-warning">{showtime.movie_title}</h4>
                    <p className="small text-muted">{showtime.cinema_name} - {showtime.room_name}</p>
                    <hr className="border-secondary"/>
                    
                    <div className="d-flex justify-content-between mb-2">
                        <span>Suất chiếu:</span>
                        <span className="fw-bold">{new Date(showtime.start_time).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Ghế đặt ({selectedSeatIds.length}):</span>
                        <span className="fw-bold text-warning">{seatLabels.join(", ")}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <span>Giá vé:</span>
                        <span>{showtime.price.toLocaleString()} đ</span>
                    </div>

                    <hr className="border-white"/>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="h4">TỔNG TIỀN:</span>
                        <span className="h3 text-danger fw-bold">{totalAmount.toLocaleString()} đ</span>
                    </div>

                    <button 
                        onClick={handleConfirmPayment} 
                        className="btn btn-warning w-100 py-3 fw-bold text-uppercase shadow"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'THANH TOÁN NGAY'}
                    </button>
                    <p className="text-center small text-muted mt-2">Vé sẽ được gửi qua email sau khi thanh toán.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;