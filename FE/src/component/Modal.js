import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;
export const showConfirm = ({ title, content, onOk, onCancel }) => {
    confirm({
        zIndex: 9999,
        bodyStyle: { height: 150 },
        centered: true,
        icon: <ExclamationCircleFilled />,
        title: title,
        content: content,
        onOk() {
            onOk();
        },
        onCancel() {
            onCancel();
        },
    });
};
