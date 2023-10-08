var jwt = require('jsonwebtoken');
JWT_SECRET = 'modaserisagoode@boy';

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token and add the id to the req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        // Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })   
    }

}

module.exports = fetchuser;