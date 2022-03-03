const util = require("../module/util");
const vehiclesService = require("../service/vehiclesService");

module.exports = {
    getDirections: async (req, res) => {
        const {
            query: {
                origin, 
                destination,
            },
        } = req;

        try {
            const data = await vehiclesService.getDirections(origin, destination);
            if(data == -1){
                return res.status(400).send(util.fail(400, '경로를 찾을 수 없습니다.'));
            }
            return res.status(200).send(util.success(200, '길찾기 성공', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    },
    getCallTaxi: async (req, res) => { //userId 받아야함
        const {
            body: {
                origin,
                carType
            },
            user: {
                id: userId
            }
        } = req;

        try {
            const data = await vehiclesService.getCallTaxi(origin, carType, userId);
            if(data == -1){
                return res.status(400).send(util.fail(400, '경로를 찾을 수 없습니다.'));
            }else if(data == -2){
                return res.status(400).send(util.fail(400, `${carType}이 근처에 없습니다.`));
            }else if(data == -3){
                return res.status(400).send(util.fail(400, '10분 이내의 차량을 찾을 수 없습니다.'));
            }
            return res.status(200).send(util.success(200, '호출하기 성공', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    },
};