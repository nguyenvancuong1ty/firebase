import { Space, Spin } from 'antd';

function LoadingAntd() {
    return (
        <Space className="billing-loader" style={{ zIndex: 99 }}>
            <Spin tip="Loading..." size="large">
                <span className="content" style={{ marginRight: 50 }} />
            </Spin>
        </Space>
    );
}

export default LoadingAntd;
