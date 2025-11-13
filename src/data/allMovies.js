// File này giả lập database chứa tất cả phim của bạn
export const allMovies = [
  // Phim Đang Chiếu
  {
    id: 1,
    title: 'Avenger 2: Đế Chế Ultron',
    genre: 'Hành động | 120 phút',
    posterUrl: '/assets/img/aven2018063_cover_0.jpg',
    release_date: '2025-10-01',
    status: 'now_showing', // Trạng thái: Đang chiếu
    description: 'Khi Tony Stark cố gắng khởi động một chương trình gìn giữ hòa bình, mọi thứ trở nên tồi tệ...',
    trailerUrl: 'https://www.youtube.com/embed/tmeOjFno6Do'
  },
  {
    id: 2,
    title: 'Avenger 1',
    genre: 'Hành động | 95 phút',
    posterUrl: '/assets/img/aven2023001_cov.jpg',
    release_date: '2025-09-15',
    status: 'now_showing',
    description: 'Biệt đội siêu anh hùng đầu tiên của Trái Đất tập hợp lại để chống lại Loki.',
    trailerUrl: 'https://www.youtube.com/embed/eOrNdBpGMv8'
  },
  {
    id: 3,
    title: 'Avenger 3: Cuộc Chiến Vô Cực',
    genre: 'Hành động | 110 phút',
    posterUrl: '/assets/img/avnfor2021012_cover_0.jpg',
    release_date: '2025-09-20',
    status: 'now_showing',
    description: 'Các Siêu anh hùng phải hợp tác để ngăn chặn Thanos thu thập các viên đá vô cực.',
    trailerUrl: 'https://www.youtube.com/embed/8_rTIAOohas'
  },
  
  // Phim Sắp Chiếu
  {
    id: 4,
    title: 'Kẻ Trộm Mặt Trăng 4',
    genre: 'Hoạt hình | Hài hước',
    posterUrl: '/assets/img/trommt.jpg',
    release_date: '2025-12-25',
    status: 'coming_soon', // Trạng thái: Sắp chiếu
    description: 'Gru và gia đình chào đón thành viên mới, Gru Jr., người quyết tâm gây rối cho cha mình.',
    trailerUrl: 'https://www.youtube.com/embed/8nBoEAkM0Rc?si=iKtRpcQ2i-LmC3CP'
  },
  {
    id: 5,
    title: 'Biệt Đội Siêu Anh Hùng Mới',
    genre: 'Hành động | Viễn tưởng',
    posterUrl: '/assets/img/4tcs7iccuuf31.jpg',
    release_date: '2026-01-01',
    status: 'coming_soon',
    description: 'Một thế hệ anh hùng mới phải tập hợp để đối mặt với một mối đe dọa vũ trụ.',
    trailerUrl: 'https://www.youtube.com/embed/I5ZE9PcJf5c?si=ynkH6mundYoYWY_j' 
  },
  {
    id: 6,
    title: 'Chuyện Tình Mùa Đông',
    genre: 'Lãng mạn | Tâm lý',
    posterUrl: '/assets/img/elle-viet-nam-top-20-bo-phim-tinh-cam-19-1024x1514.jpg',
    release_date: '2026-02-14',
    status: 'coming_soon',
    description: 'Câu chuyện tình yêu lãng mạn diễn ra vào mùa đông tuyết trắng tại một thị trấn nhỏ.',
    trailerUrl: 'https://www.youtube.com/embed/oKwmsNEDceE?si=lHlTTkkAJQeALdFY' 
  },

  {
    id: 7,
    title: 'Phim Mới Đang Chiếu 1',
    genre: 'Kinh dị | 115 phút',
    posterUrl: '/assets/img/new-now-1.jpg', // Bạn cần chuẩn bị ảnh này
    release_date: '2025-11-01',
    status: 'now_showing',
    description: 'Một bộ phim kinh dị mới ra rạp.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 8,
    title: 'Phim Mới Đang Chiếu 2',
    genre: 'Tình cảm | 100 phút',
    posterUrl: '/assets/img/new-now-2.jpg', // Bạn cần chuẩn bị ảnh này
    release_date: '2025-11-05',
    status: 'now_showing',
    description: 'Một câu chuyện tình lãng mạn.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 9,
    title: 'Phim Mới Sắp Chiếu 1',
    genre: 'Phiêu lưu | 130 phút',
    posterUrl: '/assets/img/new-soon-1.jpg', // Bạn cần chuẩn bị ảnh này
    release_date: '2026-03-01',
    status: 'coming_soon',
    description: 'Cuộc phiêu lưu đến vùng đất chưa ai biết tới.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 10,
    title: 'Phim Mới Sắp Chiếu 2',
    genre: 'Tài liệu | 90 phút',
    posterUrl: '/assets/img/new-soon-2.jpg', // Bạn cần chuẩn bị ảnh này
    release_date: '2026-03-15',
    status: 'coming_soon',
    description: 'Khám phá thế giới tự nhiên hoang dã.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
// ... đặt trước dấu ]; của mảng allMovies
];