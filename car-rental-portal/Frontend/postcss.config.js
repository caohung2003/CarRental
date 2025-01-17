module.exports = {
  plugins: [
    require('tailwindcss')({
      prefix: 'tw-', // Thay 'your-prefix-' bằng tiền tố bạn muốn sử dụng
      ignore: [''], // Danh sách các lớp bạn muốn bỏ qua nếu cần
    }),
    // Các plugin khác nếu có
  ],
};
