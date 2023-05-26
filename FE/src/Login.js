import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
const Login = ({ setShow }) => {
    const handleLoginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // Đăng nhập thành công
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                localStorage.setItem('token', token);
                localStorage.setItem('uid', user.uid);
                setShow(false);
            })
            .catch((error) => {
                // Xử lý lỗi đăng nhập
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Đăng nhập thất bại', errorCode, errorMessage);
            });
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

export default Login;
