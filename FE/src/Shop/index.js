import axios from 'axios';
import React from 'react';

const Shop = () => {
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
            </div>
        </div>
    );
};

export default Shop;
