import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Search.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function Search() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isShow, setShow] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [textSearch, setTextSearch] = useState('');
    useEffect(() => {
        if(textSearch.trim().length <= 0 ) {
            return;
        }
        setLoading(true);
        const fetchData = async () => {
            await axios({
                method: 'post',
                url: `https://cakebyme.shop:3000/v1/api/search`,
                data : {
                    name: textSearch
                }
            })
                .then((res) => {
                    setData(res.data.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('error:', err);
                    setLoading(false);
                });
            };
                fetchData();
    },[textSearch]);

    useEffect(() => {
        window.addEventListener('click', () => {
            setShow(false);
        })
    }, [])
    const handleSearch = (e) => {
        setShow(false);
        setTextInput(e.target.value); 
    }
    const handleKeyUp = (e) => {
        if(e.key === "Enter") {
            setTextSearch(textInput);
            setTimeout(() => {
                setShow(true);
            }, 200);
        }
    }

    const searchClick = () => {
            setTextSearch(textInput);
            setTimeout(() => {
                setShow(true);
            }, 200);
    }   
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
                    data.length > 0 ? (
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
                                        <b>{item.nameCake}</b>
                                        <div>
                                            <h1>
                                                Giá:{' '}
                                                {(item.price - (item.price * item.sale) / 100).toLocaleString('en-US')}
                                            </h1>
                                            <b>{item.total_quantity}</b>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="search no-product">Không có sản phẩm phù hợp</div>
                    )
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
}

export default Search;