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

    getCallTaxi: async (origin, destination, carType) => { //userId전달받아야함
        try { 
            //차종 일치, 10분 이내에 있는 기사들 중 랜덤으로 골라야함
            //const cars = await Driver.findAll({ where: { carType } });
            //console.log(cars)
            const driver = await Driver.findOne({ where: { carType } }); //일단 하나만뽑자
            // await Run.create({
            //     userId: 18,
            //     driverId: driver.id,
            // });
            // const runs = await Run.findAll();

            const { name, photo, carName, carNumber, location } = driver;
            const locationJoin = location.join(',');
            const { routesData } = await findDirectionAPI(locationJoin,origin);
            return {
                name, photo, carName, carNumber, location: locationJoin, 
                estimatedTime: routesData.duration,
                routes: {
                    bound: keysToCamel(routesData.bound),
                    roads: keysToCamel(routesData.roads),
                },
            }
        } catch (error) {
            console.log(error);
            return -1;
        }
    }

}