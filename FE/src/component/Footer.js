function Footer() {
    return (
        <footer>
            <div className="footer">
                <div className="footer__head">
                    <div className="container footer__head--content">
                        <ul className="footer__head--left">
                            <li className="footer__head--left-item">
                                <img
                                    src="https://raw.githubusercontent.com/nguyenvancuong1ty/FE_clone_Egacake/main/public/img/fo1.webp"
                                    alt=""
                                    className="footer__head--left--img"
                                />
                            </li>
                            <li className="footer__head--left-item">
                                <img
                                    src="https://raw.githubusercontent.com/nguyenvancuong1ty/FE_clone_Egacake/main/public/img/fo2.webp "
                                    alt=""
                                    className="footer__head--left--img"
                                />
                            </li>
                            <li className="footer__head--left-item">
                                <img
                                    src="https://raw.githubusercontent.com/nguyenvancuong1ty/FE_clone_Egacake/main/public/img/fo3.webp"
                                    alt=""
                                    className="footer__head--left--img"
                                />
                            </li>
                            <li className="footer__head--left-item">
                                <img
                                    src="https://raw.githubusercontent.com/nguyenvancuong1ty/FE_clone_Egacake/main/public/img/fo4.webp"
                                    alt=""
                                    className="footer__head--left--img"
                                />
                            </li>
                            <li className="footer__head--left-item">
                                <img
                                    src="https://raw.githubusercontent.com/nguyenvancuong1ty/FE_clone_Egacake/main/public/img/f4.webp"
                                    alt=""
                                    className="footer__head--left--img"
                                />
                            </li>
                        </ul>
                        <div className="footer__head--right">
                            <div className="footer__head--right--icon">
                                <img
                                    src="https://nguyenvancuong1ty.github.io/intern_cake/img/email-icon.svg"
                                    alt=""
                                    className="footer__head--right--img"
                                />
                            </div>
                            <p className="footer__head--right--text">
                                Bạn muốn nhận khuyến mãi đặc biệt? Đăng ký ngay.
                            </p>
                            <div className="footer__input--content">
                                <input
                                    type="text"
                                    className="footer__input--text"
                                    placeholder="Thả email ngay để nhận ưu đãi..."
                                />
                                <div className="footer__input--icon">Đăng kí</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container footer__content">
                    <div className="row rowss">
                        <div className="col-xl-3 footer__content--item">
                            <img src="./img/logo-footer.webp" alt="" className="footer__content--logo" />
                            <div className="footer__content--contact">
                                <i className="fa-solid fa-location-dot"></i>
                                <b className="footer__contact--text">
                                    Địa chỉ:
                                    <span>150/8 Nguyễn Duy Cung, Phường 12, TP Hồ Chí Minh, Vietnam</span>
                                </b>
                            </div>
                            <div className="footer__content--contact">
                                <i className="fa-solid fa-mobile"></i>
                                <b className="footer__contact--text">
                                    Số điện thoại:
                                    <span>19006750</span>
                                </b>
                            </div>
                            <div className="footer__content--contact">
                                <i className="fa-solid fa-envelope"></i>
                                <b className="footer__contact--text">
                                    Email:
                                    <span>cuongdepchai@gmail</span>
                                </b>
                            </div>
                        </div>
                        <div className="col-xl-3 footer__content--item">
                            <b className="footer__content--title">Hỗ trợ khách hàng</b>
                            <p className="footer__content--contact">Về chúng tôi</p>
                            <p className="footer__content--contact">Hệ thống cửa hàng</p>
                            <p className="footer__content--contact">Gọi điện đặt hàng</p>
                            <p className="footer__content--contact">Xuất hóa đơn điện tử</p>
                        </div>
                        <div className="col-xl-3 footer__content--item">
                            <b className="footer__content--title">Chính sách</b>
                            <p className="footer__content--contact">Chính sách bán hàng</p>
                            <p className="footer__content--contact">Chính sách đổi trả</p>
                            <p className="footer__content--contact">Chính sách giao hàng</p>
                        </div>
                        <div className="col-xl-3 footer__content--item">
                            <b className="footer__content--title">Tổng đài hỗ trợ</b>
                            <p className="footer__content--contact">
                                Gọi mua hàng:
                                <span>19006139</span>
                                (8h-20h)
                            </p>
                            <p className="footer__content--contact">
                                Gọi bảo hành :<span>18006198</span>
                                (8h-20h)
                            </p>
                            <p className="footer__content--contact">
                                Gọi khiếu nại:
                                <span>12345670</span>
                                (8h-20h)
                            </p>
                            <b className="footer__content--title">Phương thức thanh toán</b>
                            <div className="footer__content--pay">
                                <img
                                    src="https://nguyenvancuong1ty.github.io/intern_cake/img/check1.webp"
                                    alt=""
                                    className="footer__pay--img"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <h4 className="copyright">© Bản quyền thuộc về CUONGDEPCHAI | Cung cấp bởi WWW</h4> */}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
