import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/custom-styles.css';

function PromotionDetailPage() {
  const { id } = useParams();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/promotions/${id}`)
      .then(res => res.json())
      .then(data => {
        setPromo(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="text-white text-center mt-5 pt-5">Đang tải...</div>;
  if (!promo) return <div className="text-white text-center mt-5 pt-5">Không tìm thấy ưu đãi.</div>;

  return (
    <div className="bg-dark-section text-white" style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px'}}>
      <div className="container">
        <div className="row">
            <div className="col-md-6 mb-4">
                <img src={promo.image_url.startsWith('http') ? promo.image_url : process.env.PUBLIC_URL + promo.image_url} 
                     className="img-fluid rounded shadow border border-warning" alt={promo.title} />
            </div>
            <div className="col-md-6">
                <h2 className="text-warning text-uppercase mb-3">{promo.title}</h2>
                <p className="text-white-50 fs-5"><i className="far fa-calendar-alt me-2"></i> 
                    Thời gian: {new Date(promo.start_date).toLocaleDateString('vi-VN')} - {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                </p>
                <hr className="border-secondary"/>
                <div className="lead mb-4">{promo.description}</div>
                
                {/* Nội dung chi tiết giả lập thêm */}
                <div className="bg-dark p-4 rounded border border-secondary mb-4">
                    <h5 className="text-warning">Điều khoản áp dụng:</h5>
                    <ul className="text-white-50 small">
                        <li>Áp dụng tại tất cả các rạp trên toàn quốc.</li>
                        <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác.</li>
                        <li>Vui lòng xuất trình thẻ thành viên khi mua vé.</li>
                    </ul>
                </div>

                <Link to="/" className="btn btn-outline-warning rounded-pill px-4">
                    <i className="fas fa-arrow-left me-2"></i> Quay lại
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionDetailPage;