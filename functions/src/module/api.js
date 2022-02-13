const axios = require('axios');
const querystring = require('qs');
const { naver_client_id, naver_client_secret } = require('../config/naverAPI');

module.exports = {
    getNaverTokenByCodeAPI: async (code) => {
        try {
            const api_url = 
                `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code` +
                `&client_id=${naver_client_id}` + 
                `&client_secret=${naver_client_secret}` +
                `&code=${code}`;
            
            const tokenData = await axios.get(api_url);
            console.log('🚀🚀🚀 ', tokenData);
            
            return tokenData;
        } catch (error) {
            console.log('❌ Naver request API Error: ', error);
            return new Error(error);
        }
    },

    NaverAuthAPI: async (naverAccessToken) => {
        try {
            const verifyUser = await axios({
                method: 'GET',
                url: 'https://openapi.naver.com/v1/nid/verify',
                body: {
                    info: true,
                },
                Headers: {
                    Authorization: `Bearer ${naverAccessToken}`,
                },
            });
            console.log('🚀🚀🚀 ', verifyUser);

            const user = await axios({
                method: 'GET',
                url: 'https://openapi.naver.com/v1/nid/me',
                Headers: {
                    Authorization: `Bearer ${naverAccessToken}`,
                },
            });

            const naverUser = user.data.response;
            // TODO: 에러처리
            console.log('🐯🐯🐯 ', naverUser);

            return naverUser;
        } catch (error) {
            console.log('❌ Cannot find Naver User: ', error);
            return new Error(error);
        }
    },
}