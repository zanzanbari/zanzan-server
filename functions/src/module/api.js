const fetch = require('node-fetch');
const qs = require('qs');
const jwt = require('jsonwebtoken');

module.exports = {
    NaverAuthAPI: async (naverAccessToken) => {
        try {
            const apiUrl = 'https://openapi.naver.com/v1/nid/me';
            const userData = await (
                await fetch(apiUrl, {
                    method: 'POST', // GET 안되고 POST이어야 함
                    headers: {
                        Authorization: `Bearer ${naverAccessToken}`,
                    },
                })
            ).json(); // json 형태로 받는거 잊지 마라
            const naverUser = userData.response;
            return naverUser;
        } catch (error) {
            console.log('❌ Cannot find Naver User: ', error);
            return new Error(error);
        }
    },

    KakaoAuthAPI: async (accessToken) => {
        try {
            const data = await fetch('https://kapi.kakao.com/v2/user/me', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(async (res) => {
                let jsonRes = await res.json();
                let nickname = jsonRes.properties['nickname'];
                let email = jsonRes.kakao_account['email'];
                return {nickname, email}
            });
            return data;
        } catch (error) {
            console.log('❌ Cannot find Kakao User: ', error);
            return new Error(error);
        }
    },

    AppleAuthAPI: async (appleAccessToken) => {
        try {
            const appleUser = jwt.decode(appleAccessToken);
            console.log(appleUser);
            return appleUser;
        } catch (error) {
            console.log('❌ Cannot find Apple User: ', error);
            return new Error(error);  
        }
    },
}