import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  
  // State form
  const [formData, setFormData] = useState({
    title: '', description: '', discount_percentage: 0, 
    start_date: '', end_date: '', image_url: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const res = await fetch('http://localhost:5000/api/promotions');
    const data = await res.json();
    setPromotions(data);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa ưu đãi này?")) return;
    await fetch(`http://localhost:5000/api/admin/promotions/${id}`, { method: 'DELETE' });
    fetchPromotions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
        ? `http://localhost:5000/api/admin/promotions/${editingId}` 
        : `http://localhost:5000/api/admin/promotions`;
    
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    
    if(res.ok) {
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setFormData({ title: '', description: '', discount_percentage: 0, start_date: '', end_date: '', image_url: '' });
        setEditingId(null);
        fetchPromotions();
    } else {
        alert("Có lỗi xảy ra");
    }
  };

  const handleEdit = (promo) => {
    setEditingId(promo.promotion_id);
    // Format ngày để đưa vào input date
    const start = new Date(promo.start_date).toISOString().split('T')[0];
    const end = new Date(promo.end_date).toISOString().split('T')[0];
    setFormData({ ...promo, start_date: start, end_date: end });
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-dark text-white" style={{maxHeight: '100vh', overflowY: 'auto'}}>
        <h2 className="mb-4 text-warning border-bottom border-secondary pb-2">Quản Lý Ưu Đãi</h2>

        {/* --- FORM --- */}
        <div className="card p-4 mb-5 shadow bg-dark border border-secondary">
            <h4 className="text-warning mb-3">
                <i className={editingId ? "fas fa-edit me-2" : "fas fa-plus-circle me-2"}></i>
                {editingId ? "Chỉnh Sửa Ưu Đãi" : "Thêm Ưu Đãi Mới"}
            </h4>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label className="form-label text-white-50">Tên chương trình</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label text-white-50">Ngày bắt đầu</label>
                        <input type="date" className="form-control bg-secondary text-white border-0" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label text-white-50">Ngày kết thúc</label>
                        <input type="date" className="form-control bg-secondary text-white border-0" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label text-white-50">% Giảm giá (Nếu có)</label>
                        <input type="number" className="form-control bg-secondary text-white border-0" value={formData.discount_percentage} onChange={e => setFormData({...formData, discount_percentage: e.target.value})} />
                    </div>
                    <div className="col-md-12 mb-3">
                        <label className="form-label text-white-50">Link Ảnh Banner</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label text-white-50">Mô tả chi tiết</label>
                        <textarea className="form-control bg-secondary text-white border-0" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-warning fw-bold text-dark px-4">{editingId ? "CẬP NHẬT" : "THÊM MỚI"}</button>
                    {editingId && <button type="button" className="btn btn-outline-light" onClick={() => {setEditingId(null); setFormData({ title: '', description: '', discount_percentage: 0, start_date: '', end_date: '', image_url: '' })}}>Hủy</button>}
                </div>
            </form>
        </div>

        {/* --- DANH SÁCH --- */}
        <div className="table-responsive rounded shadow">
            <table className="table table-dark table-hover table-bordered mb-0 align-middle">
                <thead className="table-secondary text-dark">
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center" style={{width: '100px'}}>Ảnh</th>
                        <th>Tên Chương Trình</th>
                        <th>Thời Gian</th>
                        <th className="text-center">Giảm</th>
                        <th className="text-center" style={{width: '120px'}}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map(promo => (
                        <tr key={promo.promotion_id}>
                            <td className="text-center">{promo.promotion_id}</td>
                            <td className="text-center">
                                <img src={promo.image_url.startsWith('http') ? promo.image_url : process.env.PUBLIC_URL + promo.image_url} 
                                     alt="" style={{height: '50px', borderRadius: '4px', objectFit: 'cover'}} />
                            </td>
                            <td className="fw-bold text-warning">{promo.title}</td>
                            <td className="small text-white-50">
                                {new Date(promo.start_date).toLocaleDateString('vi-VN')} <br/>
                                <i className="fas fa-arrow-down text-muted"></i> <br/>
                                {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="text-center fw-bold text-success">
                                {promo.discount_percentage > 0 ? `-${promo.discount_percentage}%` : '-'}
                            </td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEdit(promo)}><i className="fas fa-edit"></i></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(promo.promotion_id)}><i className="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPromotionsPage;