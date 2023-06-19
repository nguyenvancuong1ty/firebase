import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { GithubAuthProvider } from 'firebase/auth';

const provider = new GithubAuthProvider();
const LoginGithub = ({ setShow, setUid }) => {
    const handleLoginWithGithub = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                console.log(user);
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                console.log(error);
                // ...
            });
    };

    return (
        <div style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTwitter} style={{ color: '#38bc6b' }} size="2xl" onClick={handleLoginWithGithub} />
        </div>
    );
};

export default LoginGithub;
