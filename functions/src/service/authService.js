const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwtHandler = require('../module/jwtHandler');
const { emailValidator, passwordValidator } = require('../module/validator');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
/**
 *  @회원가입
 *  @route POST /auth/join
 *  @access public
 */
    join: async (userDTO) => {
        const { email, nickname , password } = userDTO;
        // 에러1: 필수 입력값 없음 
        if (!email || !nickname || !password) return -1;
        // 에러2,3: 형식 오류
        if ( !emailValidator(email) ) return -2;
        if ( !passwordValidator(password)) return -3;

        try {
            const existUser = await User.findOne({ where: { email } });
            // 애러4: 이미 존재하는 유저
            if (existUser) return -4;

            // pwd 해싱 후 디비에 유저 생성 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                email,
                password: hashedPassword,
                nickname,
            });
            if (newUser) return true;
        } catch (error) {
            console.log(error);
            // 에러5: DB에러
            return -5;
        }
    },
/**
 *  @로그인
 *  @route POST /auth/login
 *  @access public
 */
    login: async (userDTO) => {
        const { email, password } = userDTO;
        // 에러1: 필요한 값 없음
        if (!email || !password) return -1;
        // 에러2: 이메일 형식 오류
        if ( !emailValidator(email) ) return -2;

        try {
            const isUser = await User.findOne({ where: { email } });
            if (!isUser) return -3; // 에러3: 해당 유저 없음
            const isMatch = await bcrypt.compare(password, isUser.password);
            if (!isMatch) return -4; // 에러4: 비밀번호 일치하지 않음

            const { accesstoken } = jwtHandler.issueAccessToken(isUser);
            const { refreshtoken } = jwtHandler.issueRefreshToken();
            await User.update({
                refreshtoken,
            }, {
                where: { email },
            });

            let user = {
                nickname: isUser.nickname,
                accesstoken,
                refreshtoken,
            };
            return user;
        } catch (error) {
            console.log(error);
            // 에러5: DB에러
            return -5;
        }
    },
/**
 *  @로그아웃
 *  @route POST /auth/logout
 *  @access private
 */
    logout: async (userDTO) => {
        const { nickname, email } = userDTO;

        try {
            await User.update({
                refreshtoken: null 
            }, { 
                where: { email } 
            });

            let logoutUser = {
                nickname,
            };
            return logoutUser;
        } catch (error) {
            console.log(error);
            // 에러1: DB에러
            return -1;
        }
    },

    reissueToken: async (token) => {
        const { accesstoken, refreshtoken } = token;
        // 에러1: 필요한 값 없음
        if (!accesstoken || !refreshtoken) return -1;

        try {
            const refreshtokenDecode = jwtHandler.verifyToken(refreshtoken);
            // 리프레시 토큰도 만료 시 재로그인 요청
            if (refreshtokenDecode === TOKEN_EXPIRED || refreshtokenDecode === TOKEN_INVALID) return -2;

            const user = await User.findOne({ where : { refreshtoken } });
            const { accesstoken } = jwtHandler.issueAccessToken(user);
            return accesstoken;
        } catch (error) {
            console.log(error);
            // 에러3: DB에러
            return -3;
        }
    },
}
