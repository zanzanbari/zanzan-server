const functions = require('firebase-functions');
const util = require('../module/util');
const jwtHandler = require('../module/jwtHandler');
const User = require('../database/models/user');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkUserByToken: async (req, res, next) => {
        const { accesstoken, refreshtoken } = req.headers;
        if (!accesstoken) return res.send(util.fail(400, '토큰이 없습니다.'));

        try {
            const accesstokenDecode = jwtHandler.verifyToken(accesstoken);
            const refreshtokenDecode = jwtHandler.verifyToken(refreshtoken);

            if (accesstokenDecode === TOKEN_EXPIRED || accesstokenDecode === TOKEN_INVALID) {

                if (refreshtokenDecode === TOKEN_EXPIRED || refreshtokenDecode === TOKEN_INVALID) {
                    return res.send(util.fail(401, '토큰이 만료되었습니다. 다시 로그인 하세요.'));
                } else {
                    const user = await User.findOne({ where: { refreshtoken } });
                    // accesstoken 재발급
                    const { accesstoken: newAccesstoken } = jwtHandler.issueAccessToken(user);
                    // 클라에 넘겨줄 엑세스 토큰
                    res.cookie('accesstoken', newAccesstoken);
                    req.cookies.accesstoken = newAccesstoken;
                    req.user = user;
                    next();
                }
            } else if (refreshtokenDecode === TOKEN_EXPIRED || refreshtokenDecode === TOKEN_INVALID) {
                const idFirebase = accesstokenDecode.idFirebase;
                const user = await User.findOne({ where: { idFirebase } });
                const { refreshtoken: newRefreshtoken } = jwtHandler.issueRefreshToken();
                // 클라에 넘겨줄 리프레쉬 토큰
                res.cookie('refreshtoken', newRefreshtoken);
                req.cookies.refreshtoken = newRefreshtoken;
                req.user = user;
                next();
            } else {
                const idFirebase = accesstokenDecode.idFirebase;
                const user = await User.findOne({ where: { idFirebase } });
                req.user = user;
                next();
            }
        } catch (error) {
            console.log(error);
            functions.logger.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accesstoken);
            res.send(util.fail(500, '서버 내 오류'));
        } 
    },
}

module.exports = authUtil;