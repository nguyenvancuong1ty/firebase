import { useState } from 'react';
import { decrease, increment } from '~/redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';

function Quantity({ item, setTotal, checkOut }) {
    const dispatch = useDispatch();
    const [num, setNum] = useState(item.quantity);
    const handleIncrease = async (item) => {
        dispatch(increment());
        setNum((prev) => prev + 1);
        await axios({
            url: `http://localhost:3000/firebase/api/cart/${item.id}`,
            method: 'patch',
            data: {
                quantity: num + 1,
            },
        });
        if (checkOut.some((checkedItem) => checkedItem.cakeID === item.cakeID)) {
            setTotal((prev) => prev + item.cake.price);
        }
    };

    const handleDecrease = async (item) => {
        dispatch(decrease());
        setNum((prev) => prev - 1);
        await axios({
            url: `http://localhost:3000/firebase/api/cart/${item.id}`,
            method: 'patch',
            data: {
                quantity: num - 1,
            },
        });
        if (checkOut.some((checkedItem) => checkedItem.cakeID === item.cakeID)) {
            setTotal((prev) => prev - item.cake.price);
        }
    };

    return (
        <>
            <span onClick={() => handleDecrease(item)}>-</span>
            <b className="b">{num}</b>
            <span onClick={() => handleIncrease(item)}>+</span>
        </>
    );
}

export default Quantity;
