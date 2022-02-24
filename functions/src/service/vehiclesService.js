const _ = require('lodash');
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

}