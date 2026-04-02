export const metadata = {
  id: 'city-driving',
  title: 'Lái xe thành phố',
  description: 'Điều hướng qua đường phố đông đúc, tuân thủ đèn tín hiệu và giới hạn tốc độ.',
  difficulty: 'medium',
  thumbnail: '/assets/simulation/city-driving-thumb.jpg',
  durationSeconds: 180,
}

export const violations = [
  {
    id: 'red-light',
    label: 'Vượt đèn đỏ',
    penalty: 20,
    lesson: 'Vượt đèn đỏ vi phạm Luật GTĐB, gây nguy hiểm cho bản thân và người tham gia giao thông khác.',
    lawReference: 'Điều 9, Luật Giao thông Đường bộ 2008',
  },
  {
    id: 'speeding',
    label: 'Chạy quá tốc độ',
    penalty: 15,
    lesson: 'Tốc độ tối đa trong khu vực đông dân cư là 60 km/h. Chạy nhanh rút ngắn thời gian phản ứng.',
    lawReference: 'Điều 12, Luật Giao thông Đường bộ 2008',
    detect: (state) => state.speed > 60,
  },
  {
    id: 'wrong-lane',
    label: 'Lấn làn đường',
    penalty: 10,
    lesson: 'Đi đúng làn giúp tránh va chạm với phương tiện ngược chiều.',
    lawReference: 'Điều 13, Luật Giao thông Đường bộ 2008',
  },
  {
    id: 'collision',
    label: 'Va chạm xe khác',
    penalty: 25,
    lesson: 'Giữ khoảng cách an toàn. Luôn quan sát gương chiếu hậu trước khi chuyển làn.',
    lawReference: 'Điều 9, Luật Giao thông Đường bộ 2008',
  },
]
