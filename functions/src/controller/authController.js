const AuthService = require('../service/authService');
const UserModel = require('../database/models/user');
const util = require('../module/util');

const authServiceInstance = new AuthService(UserModel);
/** 
 * 위에 저거 하기 싫어서 만든 라이브러리가 typedi 인듯??
 * @const AuthServiceInstance = Container.get(AuthService); 해주면
 * AuthService에 필요한 모든 종속성, 즉 UserModel 등등을 해결해줌
 * 이후로 그냥 AuthServiceInstance를 통해 원하는 
 * 함수들 사용하면 됨 ㅇㅇ.
 */ 

module.exports = {
    join: async (req, res) => {
        const userDTO = req.body;

        try {
            const data = await authServiceInstance.join(userDTO);
            // 에러1: 필수 입력값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '필수 입력 값이 없습니다.'));
            // 에러2: 이메일 형식 오류
            else if (data === -2) return res.status(400).send(util.fail(400,'이메일 형식이 올바르지 않습니다.'));
            // 에러3: 이미 존재하는 사용자
            else if (data === -3) return res.status(400).send(util.fail(400,'이미 존재하는 사용자입니다.'));
            // 에러5: DB에러
            else if (data === -5) return res.status(400).send(util.fail(600,'데이터베이스 오류'));
            // 회원가입 성공
            else return res.status(200).send(util.success(200, '회원가입이 완료되었습니다.', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    },

    login: async (req, res) => {
        const userDTO = req.body;

        try {
            const data = await authServiceInstance.login(userDTO);
            // 에러1: 필수 입력값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '필수 입력 값이 없습니다.'));
            // 에러2: 해당 유저 없음
            else if (data === -2) return res.status(400).send(util.fail(400,'회원가입이 필요합니다.'));
            // 에러3: 이메일 형식 오류
            else if (data === -3) return res.status(400).send(util.fail(400,'이메일 형식이 올바르지 않습니다.'));
            // 에러4: 비밀번호 오류
            else if (data === -4) return res.status(400).send(util.fail(400,'비밀번호가 일치하지 않습니다.'));
            // 에러5: DB 오류
            else if (data === -5) return res.status(400).send(util.fail(600,'데이터베이스 오류'));
            // 로그인 성공
            else return res.status(200).send(util.success(200, '로그인 되었습니다.', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    },

    logout: async (req, res) => {
        const userDTO = req.user;

        try {
            const data = await authServiceInstance.logout(userDTO);
            // 에러1: DB오류
            if (data === -1) return res.status(600).send(util.fail(600, '데이터베이스 오류'));
            // 로그아웃 성공
            else return res.status(200).send(util.success(200, '로그아웃 되었습니다.', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    }

}