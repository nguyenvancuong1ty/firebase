// webpack.config.js

const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js', // Đường dẫn đến tệp tin gốc của ứng dụng của bạn
    output: {
        path: path.resolve(__dirname, 'dist'), // Thư mục đầu ra cho các tệp tin đã xây dựng
        filename: 'bundle.js', // Tên tệp tin đã xây dựng
    },
    module: {
        rules: [
            // Các quy tắc xử lý các loại tệp tin (ví dụ: JavaScript, CSS, hình ảnh)
            // Ví dụ: Babel để biên dịch JavaScript, css-loader và style-loader để xử lý CSS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // Thêm các quy tắc xử lý khác nếu cần thiết
        ],
    },
    // Các plugin và cấu hình khác của Webpack (nếu cần)
    // Ví dụ: Tối ưu hóa, ghép nối các tệp tin, tạo mã nguồn map, v.v.
    // Đặt các plugin và cấu hình khác vào đây
};
