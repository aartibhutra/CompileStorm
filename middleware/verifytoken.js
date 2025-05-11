const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next)=>{
    try{

        const token = req.cookies.token; //receive the cookie named 'token' 
        if(!token) return res.status(401).json({
            error : "Access Denied! No token provided!"
        })
        console.log(token);
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{ // jwt token is verified and decoded, and its content is stored in req.user
            if(err){
                return res.status(403).json({
                    message : "Invalid token!"
                })
            }
            req.user = decoded;
            next(); //go to next function
        })
    } catch(err){
        console.log(err);
    }
}

module.exports = verifyToken