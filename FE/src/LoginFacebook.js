import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent } from './redux';
import axios from 'axios';
const provider = new FacebookAuthProvider();
const LoginFacebook = ({ setShow, setUid }) => {
    const handleLoginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                console.log(user, accessToken);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
                console.log(error);
                // ...
            });
    };

    return (
        <div style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon
                icon={faFacebook}
                style={{ color: '#38bc6b' }}
                size="2xl"
                onClick={handleLoginWithGoogle}
            />
        </div>
    );
};

export default LoginFacebook;
