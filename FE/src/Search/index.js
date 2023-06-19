import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Empty } from 'antd';
function Search() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isShow, setShow] = useState(false);
    const [textInput, setTextInput] = useState('');

    useEffect(() => {
        window.addEventListener('click', () => {
            setShow(false);
        });
    }, []);
    const handleSearch = (e) => {
        setShow(false);
        setTextInput(e.target.value);
    };
    const go = () => {
        setLoading(true);
        const fetchData = async () => {
            await axios({
                method: 'get',
                url: `http://localhost:3000/firebase/api/search`,
            })
                .then((res) => {
                    const newData = res.data.data.filter((item) => {
                        return item.name.toLowerCase().includes(textInput.replace(/\s/g, ''));
                    });
                    setData(newData);
                    setTimeout(() => {
                        setShow(true);
                    }, 200);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('error:', err);
                    setLoading(false);
                });
        };
        fetchData();
    };
    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            go();
        }
    };

    const searchClick = () => {
        go();
    };
    return (
        <>
            <div className="header-input">
                <input
                    type="text"
                    placeholder="Ban can gi?"
                    value={textInput}
                    onChange={(e) => {
                        handleSearch(e);
                    }}
                    onKeyUp={(e) => handleKeyUp(e)}
                />
                <div className="header__input--icon" onClick={searchClick}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div className={loading ? 'load' : 'load disable'}>
                    <span className="loader"></span>
                </div>
                {isShow ? (
                    Array.isArray(data) &&
                    (data.length > 0 ? (
                        <div className="search">
                            {data.map((item, index) => (
                                <Link
                                    to={`/detail/${item.id}`}
                                    className="item"
                                    key={index}
                                    onClick={() => {
                                        setShow(false);
                                        setTextInput('');
                                        setData([]);
                                    }}
                                >
                                    <img src={item.images} alt="" />
                                    <div className="content">
                                        <b>{item.name}</b>
                                        <div>
                                            <h1>Giá: {item.price.toLocaleString('en-US')}</h1>
                                            <b>{item.total_quantity}</b>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="search no-product">
                            <Empty></Empty>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
}

export default Search;
