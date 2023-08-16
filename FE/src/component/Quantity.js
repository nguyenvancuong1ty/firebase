import { useEffect, useState } from 'react';
import { decrease, increment, setDataCart, setTotalCoin } from '~/redux';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

function Quantity({ item, checkOut }) {
    const totalCoin = useSelector((state) => state.totalCoinReducer.totalCoin);
    const dispatch = useDispatch();
    const [num, setNum] = useState(item.quantity);
    const handleIncrease = async (item) => {
        if (checkOut.some((checkedItem) => checkedItem.cakeID === item.cakeID)) {
            dispatch(setTotalCoin(totalCoin + item.product.price));
        }
        dispatch(increment());
        setNum((prev) => prev + 1);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/cart/${item.id}`,
            method: 'patch',
            data: {
                quantity: num + 1,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        axios({
            url: `${process.env.REACT_APP_API_URL}/cart/${localStorage.getItem('uid')}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => {
                const newData = res.data.metadata.sort((a, b) => {
                    return a.product.price - b.product.price;
                });
                dispatch(setDataCart(newData));
            })
            .catch((e) => alert(e.message));
    };

    const handleDecrease = async (item) => {
        if (checkOut.some((checkedItem) => checkedItem.cakeID === item.cakeID)) {
            dispatch(setTotalCoin(totalCoin - item.product.price));
        }
        dispatch(decrease());
        setNum((prev) => prev - 1);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/cart/${item.id}`,
            method: 'patch',
            data: {
                quantity: num - 1,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        axios({
            url: `${process.env.REACT_APP_API_URL}/cart/${localStorage.getItem('uid')}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => {
                const newData = res.data.data.sort((a, b) => {
                    return a.product.price - b.product.price;
                });
                dispatch(setDataCart(newData));
            })
            .catch((e) => alert(e.message));
    };

    useEffect(() => {
        const total =
            Array.isArray(checkOut) && checkOut.length > 0
                ? checkOut.reduce((init, item) => {
                      return init + item.product.price * item.quantity;
                  }, 0)
                : 0;
        dispatch(setTotalCoin(total));
        // eslint-disable-next-line
    }, [checkOut]);
    return (
        <>
            <span onClick={() => handleDecrease(item)}>-</span>
            <b className="b">{num}</b>
            <span onClick={() => handleIncrease(item)}>+</span>
        </>
    );
}

export default Quantity;
