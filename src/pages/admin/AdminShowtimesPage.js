import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]); // Dữ liệu cho dropdown Phim
  const [rooms, setRooms] = useState([]);   // Dữ liệu cho dropdown Phòng
  
  const [formData, setFormData] = useState({
    movie_id: '', room_id: '', start_time: '', price: 75000
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Lấy danh sách lịch chiếu
    const resShow = await fetch('http://localhost:5000/api/admin/showtimes');
    setShowtimes(await resShow.json());

    // 2. Lấy danh sách phim (để chọn)
    const resMov = await fetch('http://localhost:5000/api/movies');
    setMovies(await resMov.json());

    // 3. Lấy danh sách phòng (để chọn)
    const resRoom = await fetch('http://localhost:5000/api/rooms');
    setRooms(await resRoom.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/admin/showtimes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    if(res.ok) {
        alert("Thêm lịch chiếu thành công!");
        fetchData(); // Tải lại bảng
        setFormData({ ...formData, start_time: '' }); // Reset giờ
    } else {
        alert("Lỗi khi thêm lịch chiếu");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa suất chiếu này?")) return;
    await fetch(`http://localhost:5000/api/admin/showtimes/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-dark text-white" style={{maxHeight: '100vh', overflowY: 'auto'}}>
        <h2 className="mb-4 text-warning border-bottom border-secondary pb-2">Quản Lý Lịch Chiếu</h2>

        {/* --- FORM THÊM LỊCH CHIẾU --- */}
        <div className="card p-4 mb-5 shadow bg-dark border border-secondary">
            <h4 className="text-warning mb-3"><i className="fas fa-plus-circle me-2"></i>Thêm Suất Chiếu Mới</h4>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Chọn Phim</label>
                        <select className="form-select bg-secondary text-white border-0" required 
                                onChange={e => setFormData({...formData, movie_id: e.target.value})}>
                            <option value="">-- Chọn phim --</option>
                            {movies.map(m => (
                                <option key={m.movie_id} value={m.movie_id}>{m.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Chọn Phòng Chiếu</label>
                        <select className="form-select bg-secondary text-white border-0" required
                                onChange={e => setFormData({...formData, room_id: e.target.value})}>
                            <option value="">-- Chọn phòng --</option>
                            {rooms.map(r => (
                                <option key={r.room_id} value={r.room_id}>{r.room_name} ({r.cinema_name})</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Thời gian chiếu</label>
                        {/* datetime-local giúp chọn cả ngày và giờ */}
                        <input type="datetime-local" className="form-control bg-secondary text-white border-0" required
                               onChange={e => setFormData({...formData, start_time: e.target.value})} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-white-50">Giá vé (VNĐ)</label>
                        <input type="number" className="form-control bg-secondary text-white border-0" value={formData.price}
                               onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                </div>
                <button type="submit" className="btn btn-warning fw-bold text-dark px-4">THÊM LỊCH CHIẾU</button>
            </form>
        </div>

        {/* --- DANH SÁCH LỊCH CHIẾU --- */}
        <div className="table-responsive rounded shadow">
            <table className="table table-dark table-hover table-bordered mb-0 align-middle">
                <thead className="table-secondary text-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên Phim</th>
                        <th>Phòng / Rạp</th>
                        <th>Giờ Chiếu</th>
                        <th>Giá Vé</th>
                        <th className="text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {showtimes.map(st => (
                        <tr key={st.showtime_id}>
                            <td>{st.showtime_id}</td>
                            <td className="fw-bold text-warning">{st.movie_title}</td>
                            <td>
                                {st.room_name} <br/> 
                                <small className="text-white-50">{st.cinema_name}</small>
                            </td>
                            <td>
                                {new Date(st.start_time).toLocaleDateString('vi-VN')} <br/>
                                <span className="badge bg-primary">{new Date(st.start_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                            </td>
                            <td>{st.price.toLocaleString()} đ</td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(st.showtime_id)}>
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

export default AdminShowtimesPage;