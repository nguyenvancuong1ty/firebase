function Loading() {
    return (
        <div
            className="wrap-loading"
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                zIndex: 99,
                background: '#ccc',
                justifyContent: 'center',
            }}
        >
            <div className="loading" style={{ textAlign: 'center' }}>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
            </div>
        </div>
    );
}

export default Loading;
