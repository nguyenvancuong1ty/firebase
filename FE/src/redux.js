// Import các hàm cần thiết
import { configureStore } from '@reduxjs/toolkit';

// Action types
const INCREMENT = 'INCREMENT';
const DECREASE = 'DECREASE';
const RESET = 'RESET';
const CURRENT = 'CURRENT';

// Action creators
const increment = () => ({
    type: INCREMENT,
});

const reset = () => ({
    type: RESET,
});

const setCurrent = (value) => ({
    type: CURRENT,
    payload: value,
});

const decrease = () => ({
    type: DECREASE,
});

// Initial state
const initialState = {
    number: 0,
    isAuth: localStorage.getItem('login'),
};

// Reducer
const numberReducer = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                number: state.number * 1 + 1,
            };
        case DECREASE:
            return {
                ...state,
                number: state.number * 1 - 1,
            };
        case RESET:
            return {
                ...state,
                number: 0,
            };
        case CURRENT:
            return {
                ...state,
                number: action.payload,
            };
        default:
            return state;
    }
};

// Tạo Redux store với reducer
const store = configureStore({
    reducer: { numberReducer },
});

export { increment, reset, setCurrent, decrease, store };
