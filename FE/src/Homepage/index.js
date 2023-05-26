import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';
import Cake from '~/Cake';
import Loading from '~/Loading';
import LoginCpn from '~/LoginCpn';
import useAxios from '~/useAxios';
function Home({ show, setShow }) {
    let { data, loading } = useAxios({ url: 'http://localhost:3000/firebase/api/cake', method: 'get' });

    return (
        <>
            <Container>
                {Array.isArray(data) && data.length <= 0 && !loading && <h1>Page notFound</h1>}
                <div className="wrap-container">
                    {loading && <Loading></Loading>}
                    <Row lg={4} md={3} sm={2} xl={5} xs={1}>
                        {Array.isArray(data) &&
                            data.length > 0 &&
                            !loading &&
                            data[0].data.data.map((item) => {
                                return (
                                    <Col key={item.Id}>
                                        <Cake item={item} setShow={setShow} />
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
            </Container>
            {show && <LoginCpn setShow={setShow} />}
        </>
    );
}

export default Home;
