const admin = require('firebase-admin');
const { signInWithEmailAndPassword, signOut } = require('@firebase/auth');
const { firebaseAuth } = require('../config/firebaseClient');
const User = require('../database/models/user');
const jwtHandler = require('../module/jwtHandler');
const { emailValidator } = require('../module/validator');
const { getNaverTokenByCodeAPI, NaverAuthAPI } = require('../module/api');
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
        // 추가 에러: 이메일 형식 오류
        if ( !emailValidator(email) ) return -7;

        try {
            // firebase에 유저 생성
            const userFirebase = await admin
                .auth()
                .createUser({ email, password })
                .then(user => user)
                .catch(e => {
                    console.log(e);
                    return { err: true, error: e };
                });

            if (userFirebase.err) {
                // 에러2: 이미 존재하는 사용자
                if (userFirebase.error.code === 'auth/email-already-exists') return -2;
                // 에러3: 이메일 형식 오류
                else if (userFirebase.error.code === 'auth/invalid-email') return -3;
                // 에러4: 비밀번호 형식 오류
                else if (userFirebase.error.code === 'auth/invalid-password') return -4;
                // 에러5: 파이어베이스 오류
                else return -5;
            }

            const idFirebase = userFirebase.uid;
            // 회원가입 성공 시 db에 유저 생성
            const newUser = await User.create({
                email,
                idFirebase,
                nickname
            });

            return newUser;
        } catch (error) {
            console.log(error);
            // 에러6: DB에러
            return -6;
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

        try {
            const userFirebase = await signInWithEmailAndPassword(firebaseAuth, email, password)
                .then(user => user)
                .catch(e => {
                    console.log(e);
                    return { err: true, error: e };
                });

            if (userFirebase.err) {
                // 에러2: 해당 유저 없음
                if (userFirebase.error.code === 'auth/user-not-found') return -2;
                // 에러3: 이메일 형식 오류
                else if (userFirebase.error.code === 'auth/invalid-email') return -3;
                // 에러4: 비밀번호 오류
                else if (userFirebase.error.code === 'auth/wrong-password') return -4;
                // 에러5: firebase 오류
                else return -5;
            }
            // 해당 user의 idFirebase로 유저 정보 가져오기
            const idFirebase = userFirebase.user.uid;
            const isUser = await User.findOne({ where: { idFirebase }});

            if (isUser) {
                // 토큰 발급 
                const { accesstoken } = jwtHandler.issueAccessToken(isUser);
                const { refreshtoken } = jwtHandler.issueRefreshToken();
                // refreshtoken 유저 db에 저장
                await User.update({
                    refreshtoken: refreshtoken,
                }, {
                    where: { idFirebase },
                });

                let user = {
                    nickname: isUser.nickname,
                    accesstoken,
                    refreshtoken,
                };

                return user;
            }
        } catch (error) {
            console.log(error);
            // 에러6: DB에러
            return -6;
        }
    },
/**
 *  @로그아웃
 *  @route POST /auth/logout
 *  @access private
 */
    logout: async (userDTO) => {
        const { nickname, idFirebase } = userDTO;

        try {
            await User.update({
                refreshtoken: null 
            }, { 
                where: { idFirebase } 
            });

            const logoutUser = {
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

    socialLogin: async (userDTO) => {
        const { code, social, token } = userDTO;
        // 에러1: 필수 입력 값 없음
        if (!code || !social) return -1;

        try {
            let user;
            switch (social) {
                case 'naver':
                    const naverAccessToken = await getNaverTokenByCodeAPI(code);
                    user = await NaverAuthAPI(naverAccessToken);
                    break;
                case 'kakao':
                    break;
                case 'apple':
                    break;
            }
            // 에러2: 인증되지 않은 유저
            if (!user) return -2;
            
            const email = user.email;
            const nickname = user.nickname;
            const existUser = await User.findOne({ where: { email } });
            if (!existUser) {
                const { refreshtoken } = jwtHandler.issueRefreshToken();
                const newUser = await User.create({
                    email,
                    nickname,
                    refreshtoken,
                    social,
                });
                const { accesstoken } = jwtHandler.issueAccessToken(newUser);
                newUser.accesstoken = accesstoken;
                return newUser;
            }

            const { accesstoken } = jwtHandler.issueAccessToken(existUser);
            const { refreshtoken } = jwtHandler.issueRefreshToken();

            await User.update({
                refreshtoken,
            }, {
                where: { email },
            });

            const socialUser = {
                nickname: existUser.nickname,
                accesstoken,
                refreshtoken,
            };
            return socialUser;
        } catch (error) {
            console.log(error);
            return -3;
        }

    },
}
