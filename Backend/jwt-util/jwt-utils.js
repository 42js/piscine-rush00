const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('../lib/redis');
const secret = process.env.TOKEN_SECRET_KEY;


module.exports = {
    access_sign : (user) => {
        const payload = {
            id: user.id,
        }
        return jwt.sign(payload, secret, {
            expiresIn: '1h'
        });
    },
    access_verifiy : (access_token)=>{
        let decoded = null;
        try{
            decoded = jwt.verify(access_token, secret);
            return {
                ok: true,
                id:decoded.id
            }
        }catch(error){
            return{
                ok:false,
                message: error.message
            };
        }
    },
    refresh_sign: ()=>{
        return jwt.sign({}, secret, {
            expiresIn:'14d'
        });
    },
    refresh_verify : async (refresh_token, userId)=>{
        const getAsync = promisify(redisClient.get).bind(redisClient);
        try {
            const data = await getAsync(userId);
            if (token === data){   //레디스에 저장된 토큰과 비교
                try {
                    jwt.verify(refresh_token, secret);
                    return true;
                }catch(err){
                    console.log(error.message);
                    return false;
                }
            }
            else{
                return false;
            }
        }
        catch(error){
            console.log(error.message);
            return false;
        }
    }
}