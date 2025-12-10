import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true); // true: Đăng nhập, false: Đăng ký
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi bấm nút Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Chọn đường dẫn API tùy theo chế độ
    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        
        if (isLoginMode) {
          // --- LƯU TRẠNG THÁI ĐĂNG NHẬP ---
          // Lưu thông tin user vào localStorage để dùng ở trang khác (như trang Đặt vé)
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          
          // Chuyển về trang chủ
          navigate('/');
        } else {
          // Nếu đăng ký thành công, chuyển sang form đăng nhập
          setIsLoginMode(true);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <section className="page-section bg-light" style={{ minHeight: '100vh', marginTop: '3rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header bg-dark text-white text-center py-4">
                <h3 className="font-weight-light my-2">
                  {isLoginMode ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  
                  {/* Form Đăng Ký cần thêm Tên và SĐT */}
                  {!isLoginMode && (
                    <>
                      <div className="form-floating mb-3">
                        <input 
                          className="form-control" 
                          name="fullName" 
                          type="text" 
                          placeholder="Họ và tên" 
                          onChange={handleChange} 
                          required 
                        />
                        <label>Họ và tên</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input 
                          className="form-control" 
                          name="phone" 
                          type="tel" 
                          placeholder="Số điện thoại" 
                          onChange={handleChange}
                          required 
                        />
                        <label>Số điện thoại</label>
                      </div>
                    </>
                  )}

                  <div className="form-floating mb-3">
                    <input 
                      className="form-control" 
                      name="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      onChange={handleChange}
                      required 
                    />
                    <label>Địa chỉ Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input 
                      className="form-control" 
                      name="password" 
                      type="password" 
                      placeholder="Password" 
                      onChange={handleChange}
                      required 
                    />
                    <label>Mật khẩu</label>
                  </div>

                  <div className="d-grid gap-2 mt-4 mb-3">
                    <button className="btn btn-primary btn-xl" type="submit">
                      {isLoginMode ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small">
                  <button 
                    className="btn btn-link text-decoration-none"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                  >
                    {isLoginMode 
                      ? "Chưa có tài khoản? Đăng ký ngay!" 
                      : "Đã có tài khoản? Đăng nhập tại đây"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;