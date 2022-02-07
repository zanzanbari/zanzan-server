const authService = require('../service/authService');
const util = require('../lib/util');

module.exports = {
    join: async (req, res) => {
        const userDTO = req.body;

        try {
            const data = await authService.join(userDTO);
            // 에러1: 필수 입력값 없음
            if (data === -1) return res.status(400).send(util.fail(400, '필수 입력 값이 없습니다.'));
            // 에러2: 이미 존재하는 사용자
            else if (data === -2) return res.status(400).send(util.fail(400,'이미 존재하는 사용자입니다.'));
            // 에러3: 비밀번호 형식 오류
            else if (data === -3) return res.status(400).send(util.fail(400,'비밀번호는 최소 6자 이상이어야 합니다.'));
            // 에러4: 파이어베이스 오류
            else if (data === -4) return res.status(400).send(util.fail(400,'파이어베이스 오류'));
            // 에러5: DB에러
            else if (data === -5) return res.status(400).send(util.fail(400,'데이터베이스 오류'));
            // 회원가입 성공
            else return res.status(200).send(util.success(200, '회원가입 성공', data));
        } catch (error) {
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    }

}