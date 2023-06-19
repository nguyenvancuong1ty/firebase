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
            dispatch(setTotalCoin(totalCoin + item.cake.price));
        }
        dispatch(increment());
        setNum((prev) => prev + 1);
        await axios({
            url: `http://localhost:3000/firebase/api/cart/${item.id}`,
            method: 'patch',
            data: {
                quantity: num + 1,
            },
        });
        axios({
            url: `http://localhost:3000/firebase/api/cart/${localStorage.getItem('uid')}`,
            method: 'get',
        })
            .then((res) => {
                const newData = res.data.data.sort((a, b) => {
                    return a.cake.price - b.cake.price;
                });
                dispatch(setDataCart(newData));
            })
            .catch((e) => alert(e.message));
    };

    const handleDecrease = async (item) => {
        if (checkOut.some((checkedItem) => checkedItem.cakeID === item.cakeID)) {
            dispatch(setTotalCoin(totalCoin - item.cake.price));
        }
        dispatch(decrease());
        setNum((prev) => prev - 1);
        await axios({
            url: `http://localhost:3000/firebase/api/cart/${item.id}`,
            method: 'patch',
            data: {
                quantity: num - 1,
            },
        });
        axios({
            url: `http://localhost:3000/firebase/api/cart/${localStorage.getItem('uid')}`,
            method: 'get',
        })
            .then((res) => {
                const newData = res.data.data.sort((a, b) => {
                    return a.cake.price - b.cake.price;
                });
                dispatch(setDataCart(newData));
            })
            .catch((e) => alert(e.message));
    };
    useEffect(() => {
        const total =
            Array.isArray(checkOut) && checkOut.length > 0
                ? checkOut.reduce((init, item) => {
                      return init + item.cake.price * item.quantity;
                  }, 0)
                : 0;
        dispatch(setTotalCoin(total));
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
