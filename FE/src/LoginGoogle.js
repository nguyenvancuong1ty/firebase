import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent } from './redux';
import axios from 'axios';

const LoginGoogle = ({ setShow, setUid }) => {
    const dispatch = useDispatch();
    const number = useSelector((state) => state.numberReducer.number);
    const handleLoginWithGoogle = async () => {
        try {
            // Đăng nhập thành công
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            const ok = await axios({
                method: 'post',
                url: 'http://localhost:3000/firebase/api/login-google',
                data: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
                withCredentials: true,
            });

            setUid(user.uid);
            console.log(ok);
            localStorage.setItem('token', ok.data.accessToken);
            localStorage.setItem('address', ok.data.address);
            localStorage.setItem('uid', user.uid);
            localStorage.setItem('account', 'customer');
            dispatch(setCurrent(number));
            setShow(false);
        } catch (error) {
            // Xử lý lỗi đăng nhập
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Đăng nhập thất bại', errorCode, errorMessage);
        }
    };

    return (
        <div style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon
                icon={faGooglePlusG}
                style={{ color: '#38bc6b' }}
                size="2xl"
                onClick={handleLoginWithGoogle}
            />
        </div>
    );
};

export default LoginGoogle;
