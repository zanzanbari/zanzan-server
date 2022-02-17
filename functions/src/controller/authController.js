const authService = require('../service/authService');
const util = require('../module/util');

module.exports = {
    join: async (req, res) => {
        const userDTO = req.body;

        try {
            const data = await authService.join(userDTO);
            // 에러1: 필수 입력값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '필수 입력 값이 없습니다.'));
            // 에러2: 이메일 형식 오류
            else if (data === -2) return res.status(400).send(util.fail(400,'이메일 형식이 올바르지 않습니다.'));
            // 에러3: 비밀번호 형식 오류
            else if (data === -3) return res.status(400).send(util.fail(400,'비밀번호는 영문, 숫자, 특수기호 조합으로 생성해야 합니다.'));
            // 에러4: 이미 존재하는 사용자
            else if (data === -4) return res.status(400).send(util.fail(400,'이미 존재하는 사용자입니다.'));
            // 에러5: DB에러
            else if (data === -5) return res.status(600).send(util.fail(600,'데이터베이스 오류'));
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
            const data = await authService.login(userDTO);
            // 에러1: 필수 입력값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '필수 입력 값이 없습니다.'));
            // 에러2: 이메일 형식 오류
            else if (data === -2) return res.status(400).send(util.fail(400,'이메일 형식이 올바르지 않습니다.'));
            // 에러3: 해당 유저 없음
            else if (data === -3) return res.status(400).send(util.fail(400,'회원가입이 필요합니다.'));
            // 에러4: 비밀번호 오류
            else if (data === -4) return res.status(400).send(util.fail(400,'비밀번호가 일치하지 않습니다.'));
            // 에러5: DB 오류
            else if (data === -5) return res.status(600).send(util.fail(600,'데이터베이스 오류'));
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
            const data = await authService.logout(userDTO);
            // 에러1: DB오류
            if (data === -1) return res.status(600).send(util.fail(600, '데이터베이스 오류'));
            // 로그아웃 성공
            else return res.status(200).send(util.success(200, '로그아웃 되었습니다.', data));
        } catch (error) {
            console.log(error);
            return res.send(util.fail(500, '서버 내 오류'));
        }
    },

    reissueToken: async (req, res) => {
        const token = req.headers;

        try {
            const data = await authService.reissueToken(token);
            // 에러1: 필요한 값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '토큰이 없습니다.'));
            // 에러2: 토큰 모두 만료
            else if (data === -2) return res.status(401).send(util.fail(401, '다시 로그인 하십시오.'));
            // 에러3: DB에러
            else if (data === -3) return res.status(600).send(util.fail(600, '데이터베이스 오류'));
            // 토큰 재발급
            else return res.status(200).send(util.success(200, '토큰이 재발급 되었습니다.', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    },

    kakaoAuth: async (req,res) => {
        const code = req.query['code'];
        const state = req.query['state'];
        const error = req.query['error'];
        const error_description = req.query['error_description'];
        if(!code || error){ return res.status(400).send(util.fail(state, `인가 코드 발급 실패. ${error_description}`)); }

        try {
            const data = await authService.kakaoLogin(code);
            // 에러1: 필요한 값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '토큰이 없습니다.'));
            // 에러2: 토큰 모두 만료
            else if (data === -2) return res.status(401).send(util.fail(401, '다시 로그인 하십시오.'));
            // 에러3: DB에러
            else if (data === -3) return res.status(600).send(util.fail(600, '데이터베이스 오류'));
            // 토큰 재발급
            else return res.status(200).send(util.success(200, '토큰이 발급 되었습니다.', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
   }
}