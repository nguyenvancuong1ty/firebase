// Import các hàm cần thiết
import { configureStore } from '@reduxjs/toolkit';

// Action types
const INCREMENT = 'INCREMENT';
const DECREASE = 'DECREASE';
const RESET = 'RESET';
const CURRENT = 'CURRENT';
const ACCESSTOKEN = 'ACCESSTOKEN';
const TOTALCOIN = 'TOTALCOIN';
const DATACART = 'DATACART';
const TYPEPRODUCT = 'TYPEPRODUCT';

// Action creators
const setToken = (value) => ({
    type: ACCESSTOKEN,
    payload: value,
});
//
const setTypeProduct = (value) => ({
    type: TYPEPRODUCT,
    payload: value,
});
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

const setTotalCoin = (value) => ({
    type: TOTALCOIN,
    payload: value,
});

const setDataCart = (value) => ({
    type: DATACART,
    payload: value,
});

const decrease = () => ({
    type: DECREASE,
});

// Initial state
const initialState = {
    number: 0,
    isAuth: localStorage.getItem('login'),
    accessToken: '1',
    totalCoin: 0,
    dataCart: [],
    typeProduct: 'cake',
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
const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCESSTOKEN:
            return {
                ...state,
                accessToken: action.payload,
            };
        default:
            return state;
    }
};
const typeProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPEPRODUCT:
            return {
                ...state,
                typeProduct: action.payload,
            };
        default:
            return state;
    }
};
const totalCoinReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOTALCOIN:
            return {
                ...state,
                totalCoin: action.payload,
            };
        default:
            return state;
    }
};

const dataCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case DATACART:
            return {
                ...state,
                dataCart: action.payload,
            };
        default:
            return state;
    }
};
// Tạo Redux store với reducer
const store = configureStore({
    reducer: { numberReducer, tokenReducer, totalCoinReducer, dataCartReducer, typeProductReducer },
});

export { increment, reset, setCurrent, decrease, store, setToken, setTotalCoin, setDataCart, setTypeProduct };
