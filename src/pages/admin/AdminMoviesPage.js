import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  
  // State cho Form thêm/sửa
  const [formData, setFormData] = useState({
    title: '', description: '', duration_minutes: 0, genre: '', 
    release_date: '', poster_url: '', trailer_url: '', status: 'now_showing'
  });
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const res = await fetch('http://localhost:5000/api/movies');
    const data = await res.json();
    setMovies(data);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa phim này?")) return;
    await fetch(`http://localhost:5000/api/admin/movies/${id}`, { method: 'DELETE' });
    fetchMovies(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
        ? `http://localhost:5000/api/admin/movies/${editingId}` 
        : `http://localhost:5000/api/admin/movies`;
    
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    
    if(res.ok) {
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setFormData({ title: '', description: '', duration_minutes: 0, genre: '', release_date: '', poster_url: '', trailer_url: '', status: 'now_showing' });
        setEditingId(null);
        fetchMovies();
    } else {
        alert("Có lỗi xảy ra");
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie.movie_id);
    const dateStr = new Date(movie.release_date).toISOString().split('T')[0];
    setFormData({ ...movie, release_date: dateStr });
  };

  return (
    <div className="d-flex">
      {/* Sidebar giữ nguyên */}
      <AdminSidebar />

      {/* --- PHẦN NỘI DUNG CHÍNH (Đã sửa màu sắc) --- */}
      <div className="flex-grow-1 p-4 bg-dark text-white" style={{maxHeight: '100vh', overflowY: 'auto'}}>
        <h2 className="mb-4 text-warning border-bottom border-secondary pb-2">Quản Lý Phim</h2>

        {/* --- FORM THÊM/SỬA --- */}
        {/* Thêm border và nền tối cho khung nhập liệu */}
        <div className="card p-4 mb-5 shadow bg-dark border border-secondary">
            <h4 className="text-warning mb-3">
                <i className={editingId ? "fas fa-edit me-2" : "fas fa-plus-circle me-2"}></i>
                {editingId ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}
            </h4>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Tên Phim</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Nhập tên phim..." />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Thể loại</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required placeholder="Ví dụ: Hành động, Hài..." />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label text-white-50">Thời lượng (phút)</label>
                        <input type="number" className="form-control bg-secondary text-white border-0" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: e.target.value})} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label text-white-50">Ngày khởi chiếu</label>
                        <input type="date" className="form-control bg-secondary text-white border-0" value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label text-white-50">Trạng thái</label>
                        <select className="form-select bg-secondary text-white border-0" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="now_showing">Đang chiếu</option>
                            <option value="coming_soon">Sắp chiếu</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Link Poster (Ảnh)</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" value={formData.poster_url} onChange={e => setFormData({...formData, poster_url: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Link Trailer (Youtube)</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" value={formData.trailer_url} onChange={e => setFormData({...formData, trailer_url: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label text-white-50">Mô tả</label>
                        <textarea className="form-control bg-secondary text-white border-0" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Nội dung tóm tắt..."></textarea>
                    </div>
                </div>
                
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-warning fw-bold text-dark px-4">
                        {editingId ? "CẬP NHẬT" : "THÊM MỚI"}
                    </button>
                    {editingId && (
                        <button type="button" className="btn btn-outline-light" onClick={() => {setEditingId(null); setFormData({ title: '', description: '', duration_minutes: 0, genre: '', release_date: '', poster_url: '', trailer_url: '', status: 'now_showing' })}}>
                            Hủy bỏ
                        </button>
                    )}
                </div>
            </form>
        </div>

        {/* --- DANH SÁCH PHIM --- */}
        {/* Sử dụng table-dark để đồng bộ */}
        <div className="table-responsive rounded shadow">
            <table className="table table-dark table-hover table-bordered mb-0 align-middle">
                <thead className="table-secondary text-dark">
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center" style={{width: '80px'}}>Poster</th>
                        <th>Tên Phim</th>
                        <th>Thể Loại</th>
                        <th className="text-center">Trạng Thái</th>
                        <th className="text-center" style={{width: '150px'}}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <tr key={movie.movie_id}>
                            <td className="text-center">{movie.movie_id}</td>
                            <td className="text-center">
                                <img 
                                    src={movie.poster_url.startsWith('http') ? movie.poster_url : process.env.PUBLIC_URL + movie.poster_url} 
                                    alt="" 
                                    style={{height: '60px', borderRadius: '4px', objectFit: 'cover'}} 
                                />
                            </td>
                            <td className="fw-bold text-warning">{movie.title}</td>
                            <td className="small">{movie.genre}</td>
                            <td className="text-center">
                                <span className={`badge ${movie.status === 'now_showing' ? 'bg-success' : 'bg-secondary'}`}>
                                    {movie.status === 'now_showing' ? 'Đang chiếu' : 'Sắp chiếu'}
                                </span>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-outline-info me-2" title="Sửa" onClick={() => handleEdit(movie)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete(movie.movie_id)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
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

export default AdminMoviesPage;