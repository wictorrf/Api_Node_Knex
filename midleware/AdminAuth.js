const jwt = require("jsonwebtoken");
const JWTSecrete = "sadlbewjhverfewjs";
const admin = 1;

module.exports = function(req, res, next){
    const authToken = req.headers['authorization'];

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        let token = bearer[1];
        try {
            let decoded = jwt.verify(token, JWTSecrete);
            if (decoded.role == admin) {
                next();
            } else {
                return res.status(403).json({err: "Você não tem permição de acesso a essa rota!"});
            }
        } catch (error) {
            return res.status(403).json({err: "Voce não está autenticado misera!"});
        }
    }else {
        return res.status(403).json({err: "Voce não está autenticado!"});
    }
}