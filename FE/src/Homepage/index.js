import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Cake from '~/Cake';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '~/firebase';
import Loading from '~/Loading';
import Bill from '~/component/Bill';
import useAxios from '~/useAxios';
function Home(props) {
    let { data, loading } = useAxios({ url: 'http://localhost:3000/firebase/api/cake', method: 'get' });
    const [dataUser, setDataUser] = useState([]);
    const [type, setType] = useState('shipped');
    const [loading2, setLoading] = useState(false);
    // const getDataUserPendingType = async () => {
    //     await axios({
    //         url: `http://localhost:3000/firebase/api/new-order`,
    //         method: 'get',
    //     })
    //         .then((res) => {
    //             setDataUser(res.data.data);
    //             setLoading(false);
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //             setLoading(false);
    //         });
    // };
    useEffect(() => {
        if (type !== 'pending') {
            setLoading(true);
            axios({
                url: `http://localhost:3000/firebase/api/order?id=${props.uid}&type=${type}`,
                method: 'get',
            }).then((res) => {
                setDataUser(res.data.data);
                setLoading(false);
            });
        }
    }, [props.uid, type]);
    useEffect(() => {
        if (type === 'pending') {
            // setLoading(true);
            // setDataUser([]);
            // const ordersRef = collection(db, 'order');
            // const queryRef = query(ordersRef, where('status', '==', 'pending'), where('deleted', '==', false));
            // const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            //     snapshot.docChanges().forEach(async (change) => {
            //         console.log(loading);
            //         if (type === 'pending' && change.type === 'added' && change.doc.exists()) {
            //             await getDataUserPendingType();
            //         }
            //         if (change.type === 'removed') {
            //             await getDataUserPendingType();
            //         }
            //     });
            // });

            // return () => unsubscribe();
            setLoading(true);
            setDataUser([]);
            const ordersRef = collection(db, 'order');
            const queryRef = query(ordersRef, where('status', '==', 'pending'), where('deleted', '==', false));

            const unsubscribe = onSnapshot(queryRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (type === 'pending' && change.type === 'added' && change.doc.exists()) {
                        const newOrder = change.doc.data();
                        setDataUser((prev) => [...prev, { Id: change.doc.id, ...newOrder }]);
                    }
                    if (type === 'pending' && change.type === 'removed') {
                        setDataUser((prev) =>
                            prev.filter((item) => {
                                return item.Id !== change.doc.id;
                            }),
                        );
                    }
                });

                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [type]);

    let user = localStorage.getItem('account');
    return (
        <>
            <Container>
                {loading && <Loading></Loading>}
                {Array.isArray(data) && data.length <= 0 && !loading}
                {user !== 'shipper' && (
                    <div className="wrap-container">
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
            </Container>
        </>
    );
}

export default Home;
