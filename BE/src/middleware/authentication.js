const jwt = require('jsonwebtoken');
const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : false;
        if (!token) {
            res.status(401).json({
                error: 'auth',
            });
        }
        jwt.verify(token, 'shhhhh', function (err, decoded) {
            if (decoded) {
                next();
            } else {
                res.status(401).json({
                    error: 'auth',
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};
const refreshToken = (req, res) => {
    const secretKey = 'shhhhh';
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Refresh token not found' });
        } else {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid refresh token' });
                }

                // Tạo mới Access Token
                const accessToken = jwt.sign({ email: decoded.email, role: req.query.type_account }, secretKey, {
                    expiresIn: '30m',
                });
                return res.json({ accessToken });
            });
        }
    } catch (e) {
        return res.json({ error: e });
    }
};
module.exports = { authentication, refreshToken };
