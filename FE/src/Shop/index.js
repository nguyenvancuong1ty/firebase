import axios from 'axios';
import React, { useState } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '~/firebase';
const Shop = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e, '---------', e.target);
        const file = e.target[0]?.files[0];
        if (!file) return;
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL);
                });
            },
        );
    };
    const handleClick = () => {
        axios
            .post(
                `http://localhost:3000/firebase/api/refreshToken?type_account=${localStorage.getItem('account')}`,
                {},
                { withCredentials: true },
            )
            .then((response) => {
                console.log(response);
                localStorage.setItem('token', response.data.accessToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <div>
                <button onClick={handleClick}>lấy lại</button>
                <form onSubmit={handleSubmit} className="form">
                    <input type="file" />
                    <button type="submit">Upload</button>
                </form>
                {!imgUrl && (
                    <div className="outerbar">
                        <div className="innerbar" style={{ width: `${progresspercent}%` }}>
                            {progresspercent}%
                        </div>
                    </div>
                )}
                {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
            </div>
        </div>
    );
};

export default Shop;
