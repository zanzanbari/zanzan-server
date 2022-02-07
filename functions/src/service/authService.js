const admin = require('firebase-admin');
const { signInWithEmailAndPassword } = require('@firebase/auth');
const { firebaseAuth } = require('../config/firebaseClient');
const User = require('../database/models/user');

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
                // 에러3: 비밀번호 형식 오류
                else if (userFirebase.error.code === 'auth/invalid-password') return -3;
                // 에러4: 파이어베이스 오류
                else return -4;
            }

            const idFirebase = userFirebase.uid;
            // 회원가입 성공 시 db에 유저 생성
            const newUser = await User.create({
                email,
                idFirebase,
                nickname
            });
            console.log(newUser);
            return newUser;
        } catch (error) {
            console.log(error);
            // 에러4: DB에러
            return -5;
        }
    }
}