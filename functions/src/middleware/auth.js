const functions = require('firebase-functions');
const util = require('../module/util');
const jwtHandler = require('../module/jwtHandler');
const User = require('../database/models/user');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkUserByToken: async (req, res, next) => {
        const { accesstoken } = req.headers;
        if (!accesstoken) return res.status(400).send(util.fail(400, '토큰이 없습니다.'));

        try {
            const accesstokenDecode = jwtHandler.verifyToken(accesstoken);

            if (accesstokenDecode === TOKEN_EXPIRED) return res.status(401).send(util.fail(401, '토큰이 만료되었습니다.'));
            if (accesstokenDecode === TOKEN_INVALID) return res.status(401).send(util.fail(401, '토큰이 유효하지 않습니다.'));
            if (accesstokenDecode.idFirebase === undefined) return res.status(401).send(util.fail(401, '토큰이 유효하지 않습니다.'));

            const idFirebase = accesstokenDecode.idFirebase;
            const user = await User.findOne({ where : { idFirebase } });
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            functions.logger.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accesstoken);
            res.status(500).send(util.fail(500, '서버 내 오류'));
        } 
    },
}

module.exports = authUtil;