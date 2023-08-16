import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';
import Cake from '~/Cake';
import useAxios from '~/useAxios';
import { useSelector } from 'react-redux';
import Footer from '~/component/Footer';
import LoadingAntd from '~/Loading/Loading.antd';

function Home(props) {
    const typeProduct = useSelector((state) => state.typeProductReducer.typeProduct);
    let { data, loading } = useAxios({
        url: `${process.env.REACT_APP_API_URL}/product?type=${typeProduct}`,
        method: 'get',
        authentication: `Bearer ${localStorage.getItem('token')}`,
    });

    return (
        <>
            <Container>
                {loading && <LoadingAntd></LoadingAntd>}
                {Array.isArray(data) && data.length <= 0 && !loading}
                <div className="wrap-container">
                    <Row lg={4} md={3} sm={2} xl={5} xs={2}>
                        {Array.isArray(data) &&
                            data.length > 0 &&
                            !loading &&
                            data[0].data.metadata.map((item) => {
                                return (
                                    <Col key={item.Id} className="res_cake">
                                        <Cake item={item} setShow={props.setShow} />
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
            </Container>
            <Footer></Footer>
        </>
    );
}

export default Home;

// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useEffect, useState } from 'react';
// import { Col, Container, Row } from 'react-bootstrap';
// import Cake from '~/Cake';
// import { collection, onSnapshot, query, where } from 'firebase/firestore';
// import { db } from '~/firebase';
// import Loading from '~/Loading';
// import Bill from '~/component/Bill';
// import useAxios from '~/useAxios';
// import { useSelector } from 'react-redux';
// import Footer from '~/component/Footer';

// function Home(props) {
//     const typeProduct = useSelector((state) => state.typeProductReducer.typeProduct);
//     let { data, loading } = useAxios({
//         url: `http://localhost:3000/product?type=${typeProduct}`,
//         method: 'get',
//         authentication: `Bearer ${localStorage.getItem('token')}`,
//     });
//     const [dataUser, setDataUser] = useState([]);
//     const [type, setType] = useState('shipped');
//     const [loading2, setLoading] = useState(false);
//     useEffect(() => {
//         if (type !== 'pending' && localStorage.getItem('account') === 'shipper') {
//             setLoading(true);
//             axios({
//                 url: `http://localhost:3000/order?id=${props.uid}&type=${type}`,
//                 method: 'get',
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             }).then((res) => {
//                 setDataUser(res.data.metadata);
//                 setLoading(false);
//             });
//         }
//     }, [props.uid, type]);
//     useEffect(() => {
//         if (type === 'pending') {
//             setLoading(true);
//             setDataUser([]);
//             const ordersRef = collection(db, 'order');
//             const queryRef = query(ordersRef, where('status', '==', 'pending'), where('deleted', '==', false));

//             const unsubscribe = onSnapshot(queryRef, (snapshot) => {
//                 snapshot.docChanges().forEach((change) => {
//                     if (type === 'pending' && change.type === 'added' && change.doc.exists()) {
//                         const newOrder = change.doc.data();
//                         setDataUser((prev) => [...prev, { Id: change.doc.id, ...newOrder }]);
//                     }
//                     if (type === 'pending' && change.type === 'removed') {
//                         setDataUser((prev) =>
//                             prev.filter((item) => {
//                                 return item.Id !== change.doc.id;
//                             }),
//                         );
//                     }
//                 });

//                 setLoading(false);
//             });

//             return () => unsubscribe();
//         }
//     }, [type]);

//     let user = localStorage.getItem('account');
//     return (
//         <>
//             <Container>
//                 {loading && <Loading></Loading>}
//                 {Array.isArray(data) && data.length <= 0 && !loading}
//                 {user !== 'shipper' && (
//                     <div className="wrap-container">
//                         <Row lg={4} md={3} sm={2} xl={5} xs={1}>
//                             {Array.isArray(data) &&
//                                 data.length > 0 &&
//                                 !loading &&
//                                 data[0].data.metadata.map((item) => {
//                                     return (
//                                         <Col key={item.Id}>
//                                             <Cake item={item} setShow={props.setShow} />
//                                         </Col>
//                                     );
//                                 })}
//                         </Row>
//                     </div>
//                 )}

//                 {/* {user === 'shipper' && (
//                     <div className="wrap-container">
//                         {loading && <Loading></Loading>}

//                         {localStorage.getItem('uid') && !loading && (
//                             <Bill
//                                 items={dataUser}
//                                 type={type}
//                                 setType={setType}
//                                 setDataUser={setDataUser}
//                                 loading={loading2}
//                                 setLoading={setLoading}
//                             />
//                         )}
//                     </div>
//                 )} */}
//             </Container>
//             <Footer></Footer>
//         </>
//     );
// }

// export default Home;
