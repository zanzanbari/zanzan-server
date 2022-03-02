const _ = require('lodash');
const Driver = require('../models/drivers');
const Run = require('../models/runs');
const { findDirectionAPI } = require("../module/api");
const { keysToCamel } = require('../module/convertSnakeToCamel');

module.exports = {
    getDirections: async (origin, destination) => {
        try {
            const { fare, routesData } = await findDirectionAPI(origin, destination);

            const baseCost = fare.taxi + fare.toll;
            const blueCoast = baseCost + 2000;

            const {
                distance: totalDistance,
                duration: totalDuration
            } = routesData;
            let ventiCost = 4000 + fare.toll;
            if (totalDistance > 1500) {
                let distanceCost, timeCost;
                distanceCost = Math.round((totalDistance - 1500) / 123) * 100;
                timeCost = Math.round(totalDuration / 40) * 100;
                ventiCost += distanceCost + timeCost;
            }

            const carType = [{
                name: '블루',
                cost: blueCoast
            }, {
                name: '일반 택시',
                cost: baseCost
            }, {
                name: '벤티',
                cost: ventiCost
            }];
            return {
                estimatedTime: routesData.duration,
                routes: {
                    bound: keysToCamel(routesData.bound),
                    roads: keysToCamel(routesData.roads),
                },
                carType
            }
        } catch (error) {
            console.log(error);
            return -1;
        }
    },

    getCallTaxi: async () => {
        try {
            const driver = await Driver.create({
                name: '홍길동',
                carType: '일반',
                carNumber: '12가 3456',
                location: [37.392635869495585, 127.11220212894725]
            });
            return driver;
            // // 기사 DB에서 차종 일치하는 놈으로 하나 뽑아옴
            // const deriver = await Driver.findOne({ where: { carType } });
            // // 해당 유저 id와 랜뽑한 기사 id 운행DB에 생성..? 그럼 POST..?
            // await Run.create({
            //     userId,
            //     deriverId: deriver.id,
            // });
            // // 클라한테 기사 정보 다 주고, 유저 출발지는... 어디서..? origin 어케 받아올까.. 달라고 해?
            // const { routesData } = await findDirectionAPI(origin, deriver.location);
            // return {
            //     deriver,
            //     estimatedTime: routesData.duration,
            //     routes: {
            //         bound: keysToCamel(routesData.bound),
            //         roads: keysToCamel(routesData.roads),
            //     },
            // }
        } catch (error) {
            console.log(error);
            return -1;
        }
    }

}