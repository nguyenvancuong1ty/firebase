const jwt = require('jsonwebtoken');
const authorization = (authority) => (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Missing token. Authorization denied.' });
    }

    try {
        jwt.verify(token, 'shhhhh', function (err, decoded) {
            if (decoded) {
                authority.includes(decoded.role)
                    ? next()
                    : res
                          .status(403)
                          .json({ error: 'Forbidden', message: 'You do not have permission to access this resource.' });
            } else if (err) {
                res.status(401).json({
                    error: err,
                });
            }
        });
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token. Authorization denied.' });
    }
};
module.exports = authorization;
