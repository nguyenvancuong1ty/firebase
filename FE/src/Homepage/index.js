import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Cake from '~/Cake';
import Loading from '~/Loading';
import LoginCpn from '~/LoginCpn';
import Bill from '~/component/Bill';
import useAxios from '~/useAxios';
function Home(props) {
    let { data, loading } = useAxios({ url: 'http://localhost:3000/firebase/api/cake', method: 'get' });
    const [dataUser, setDataUser] = useState([]);
    const [type, setType] = useState('shipped');
    const [loading2, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (type !== 'pending') {
            axios({
                url: `http://localhost:3000/firebase/api/order?id=${props.uid}&type=${type}`,
                method: 'get',
            }).then((res) => {
                setDataUser(res.data.data);
                setLoading(false);
            });
        } else {
            axios({
                url: 'http://localhost:3000/firebase/api/new-order',
                method: 'get',
            }).then((res) => {
                setDataUser(res.data.data);
                setLoading(false);
            });
        }
    }, [props.uid, type]);
    let user = localStorage.getItem('account');
    return (
        <>
            <Container>
                {Array.isArray(data) && data.length <= 0 && !loading && <h1>Page notFound</h1>}
                {user === 'customer' && (
                    <div className="wrap-container">
                        {loading && <Loading></Loading>}
                        <Row lg={4} md={3} sm={2} xl={5} xs={1}>
                            {Array.isArray(data) &&
                                data.length > 0 &&
                                !loading &&
                                data[0].data.data.map((item) => {
                                    return (
                                        <Col key={item.Id}>
                                            <Cake item={item} setShow={props.setShow} />
                                        </Col>
                                    );
                                })}
                        </Row>
                    </div>
                )}

                {user === 'shipper' && (
                    <div className="wrap-container">
                        {loading && <Loading></Loading>}

                        {localStorage.getItem('uid') && !loading && (
                            <Bill
                                items={dataUser}
                                type={type}
                                setType={setType}
                                setDataUser={setDataUser}
                                loading={loading2}
                                setLoading={setLoading}
                            />
                        )}
                    </div>
                )}
                {!localStorage.getItem('uid') && !loading && (
                    <div className="wrap-container">
                        {loading && <Loading></Loading>}
                        <Row lg={4} md={3} sm={2} xl={5} xs={1}>
                            {Array.isArray(data) &&
                                data.length > 0 &&
                                !loading &&
                                data[0].data.data.map((item) => {
                                    return (
                                        <Col key={item.Id}>
                                            <Cake item={item} setShow={props.setShow} />
                                        </Col>
                                    );
                                })}
                        </Row>
                    </div>
                )}
            </Container>
            {props.show && <LoginCpn setShow={props.setShow} setUid={props.setUid} />}
        </>
    );
}

export default Home;
