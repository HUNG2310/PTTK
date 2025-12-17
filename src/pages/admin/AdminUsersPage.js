import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Xóa người dùng này sẽ mất hết lịch sử đặt vé của họ. Bạn chắc chứ?")) return;
    await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-dark text-white" style={{maxHeight: '100vh', overflowY: 'auto'}}>
        <h2 className="mb-4 text-warning border-bottom border-secondary pb-2">Quản Lý Người Dùng</h2>

        <div className="table-responsive rounded shadow">
            <table className="table table-dark table-hover table-bordered mb-0 align-middle">
                <thead className="table-secondary text-dark">
                    <tr>
                        <th>ID</th>
                        <th>Họ Tên</th>
                        <th>Email</th>
                        <th className="text-center">Vai Trò</th>
                        <th className="text-center">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td className="fw-bold">{user.name}</td>
                            <td>{user.email}</td>
                            <td className="text-center">
                                <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info text-dark'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="text-center">
                                {user.role !== 'admin' && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.user_id)}>
                                        <i className="fas fa-trash-alt"></i> Xóa
                                    </button>
                                )}
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

export default AdminUsersPage;