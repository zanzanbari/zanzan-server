const fetch = require('node-fetch');
const qs = require('qs');
const naver_client_id = process.env.NAVER_CLIENT_ID;
const naver_client_secret = process.env.NAVER_CLIENT_SECRETE;

module.exports = {
    getNaverTokenByCodeAndStateAPI: async (code, state) => {
        try {
            const baseUrl = 'https://nid.naver.com/oauth2.0/token';
            const config = {
                grant_type: 'authorization_code',
                client_id: naver_client_id,
                client_secret: naver_client_secret,
                code: code,
                state: state,
            };
            const queryString = qs.stringify(config);
            const finalUrl = `${baseUrl}?${queryString}`;
            const tokenData = await (
                await fetch(finalUrl, {
                    method: 'POST',
                    headers: {
                        'X-Naver-Client-Id': naver_client_id,
                        'X-Naver-Client-Secret': naver_client_secret
                    },
                })
            ).json();
            if ('error' in tokenData) {
                let { error, error_description } = tokenData;
                return new Error({ error, error_description });
            }
            const { access_token, refresh_token } = tokenData;
            const result = {
                access_token,
                refresh_token,
            };
            return result;
        } catch (error) {
            console.log('❌ Naver request API Error: ', error);
            return new Error(error);
        }
    },

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
}