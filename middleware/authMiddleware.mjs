import jwt from 'jsonwebtoken';

export const ensureAuthenticated = (req, res, next) => {
    const token = req.session.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.redirect('/login');
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};
