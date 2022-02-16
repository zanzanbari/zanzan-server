const axios = require('axios');
const querystring = require('qs');
const { naver_client_id, naver_client_secret } = require('../config/naverAPI');

module.exports = {
    getNaverTokenByCodeAPI: async (code) => {
        try {
            const baseUrl = 'https://nid.naver.com/oauth2.0/token';
            const config = {
                grant_type: 'authorization_code',
                client_id: naver_client_id,
                client_secret: naver_client_secret,
                code: code,
            };
            const params = new URLSearchParams(config).toString();
            const finalUrl = `${baseUrl}?${params}`;
            console.log('📌',finalUrl);
            const tokenData = await axios.get(finalUrl);
            console.log('📌📌',tokenData);
            if ('access_token' in tokenData) {
                const { access_token } = tokenData;
                return access_token;
            } else {
                const err = new Error('access_token 가져오기 실패');
                return err;
            }
        } catch (error) {
            console.log('❌ Naver request API Error: ', error);
            return new Error(error);
        }
    },

    NaverAuthAPI: async (naverAccessToken) => {
        try {
            // const verifyUser = await axios({
            //     method: 'GET',
            //     url: 'https://openapi.naver.com/v1/nid/verify',
            //     body: {
            //         info: true,
            //     },
            //     Headers: {
            //         Authorization: `Bearer ${naverAccessToken}`,
            //     },
            // });
            // console.log('🚀🚀🚀 verifyUser: ', verifyUser);

            const user = await axios({
                method: 'GET',
                url: 'https://openapi.naver.com/v1/nid/me',
                Headers: {
                    Authorization: `Bearer ${naverAccessToken}`,
                },
            });

            const naverUser = user.data.response;
            // TODO: 에러처리
            console.log('🐯🐯🐯 naverUser:', naverUser);

            return naverUser;
        } catch (error) {
            console.log('❌ Cannot find Naver User: ', error);
            return new Error(error);
        }
    },
}