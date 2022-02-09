const admin = require('firebase-admin');
const { signInWithEmailAndPassword } = require('@firebase/auth');
const { firebaseAuth } = require('../config/firebaseClient');
const jwtHandler = require('../module/jwtHandler');
const { emailValidator } = require('../module/validator');


module.exports = class AuthService {
    constructor (userModel) {
        this.userModel = userModel;
    }

    async join (userDTO) {
        const { email, nickname, password } = userDTO;
        // 에러1: 필수 입력값 없음
        if (!email || !nickname || !password) return -1;
        // 에러2: 이메일 형식 오류
        if ( !emailValidator(email) ) return -2;
        // TODO: 비밀번호 형식 오류

        try {
            const existUser = await this.userModel.findOne({ where: { email } });
            // 에러3: 이미 존재하는 사용자
            if (existUser) return -3;

            const userFirebase = await admin
                .auth()
                .createUser({ email, password })
                .then(user => user)
                .catch(e => {
                    console.log(e);
                    return { err: true, error: e};
                });
            
            const idFirebase = userFirebase.uid;
            const newUser = await this.userModel.create({
                email,
                idFirebase,
                nickname,
            });
            return newUser;
        } catch (error) {
            // 에러5: DB에러
            console.log(error);
            return -5;
        }
    }

    async login (userDTO) {
        const { email, password } = userDTO;
        // 에레1: 필수 입력값 없음
        if (!email || !password) return -1;

        try {
            const userFirebase = await signInWithEmailAndPassword(firebaseAuth, email, password)
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
            }

            const idFirebase = userFirebase.user.uid;
            const isUser = await this.userModel.findOne({ where: { idFirebase } });
            if (isUser) {
                const { accesstoken, refreshtoken } = jwtHandler.issueToken(isUser);
                await this.userModel.update({
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
            // 에러5: DB에러
            console.log(error);
            return -5;
        }
    }

    async logout (userDTO) {
        const { idFirebase } = userDTO;

        try {
            const logoutUser = await this.userModel.update({
                refreshtoken: null,
            }, {
                where: { idFirebase },
            });
            let user = {
                nickname: logoutUser.nickname,
                refreshtoken: logoutUser.refreshtoken,
            };
            return user;
        } catch (error) {
            // 에러1: DB에러
            console.log(error);
            return -1;
        }
    }
};
