const jwt = require('jsonwebtoken');
const secreteKey = process.env.JWT_SECRETE;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    // 토큰 발급 함수
    issueAccessToken: (user) => {
        const payload = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        };

        const result = {
            accesstoken: jwt.sign(payload, secreteKey, {
                algorithm: process.env.JWT_ALGORITHM,
                expiresIn: process.env.JWT_AC_EXPIRES,
                issuer: process.env.JWT_ISSUER,
            })
        };

        return result;
    },

    issueRefreshToken: () => {
        const result = {
            refreshtoken: jwt.sign({}, secreteKey, {
                algorithm: process.env.JWT_ALGORITHM,
                expiresIn: process.env.JWT_RF_EXPIRES,
                issuer: process.env.JWT_ISSUER,
            }),
        }

        return result;
    },

    // 토큰 검증 함수
    verifyToken: (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secreteKey);
        } catch (error) {
            if (error.message === 'jwt expired') {
                console.log('토큰이 만료되었습니다.');
                return TOKEN_EXPIRED;
            } else if (error.message === 'jwt invalid') {
                console.log('토큰이 유효하지 않습니다.');
                return TOKEN_INVALID;
            } else {
                console.log('토큰 검증 오류');
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}
