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
            return res.status(200).send(util.success(200, '길찾기 성공', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    },

    getCallTaxi: async (req, res) => {
        // const {
        //     user: {
        //         id: userId
        //     },
        //     query: {
        //         origin,
        //         carType
        //     },
        // } = req;

        try {
            const data = await vehiclesService.getCallTaxi();
            return res.status(200).send(util.success(200, '기사 배정 성공', data));
        } catch (error) {
            console.log(error);
            return res.status(500).send(util.fail(500, '서버 내 오류'));
        }
    }
};