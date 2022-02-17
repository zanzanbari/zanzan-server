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

    getKakaoTokenByCodeAPI: async (code) => {
        let accessToken;
        try {
            await fetch('https://kauth.kakao.com/oauth/token', {
                method: 'POST',
                headers: {
                    'content-type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                body: qs.stringify({
                    grant_type: 'authorization_code',//특정 스트링
                    client_id: process.env.KAKAO_CLIENT_ID,
                    redirectUri: process.env.KAKAO_REDIRECT_URI,
                    code
                }),}).then(async (res) => {
                    let jsonRes = await res.json(); //axios는 res.data
                    accessToken = jsonRes.access_token;
            });
            return accessToken;
        } catch (error) {
            console.log('❌ Kakao request API Error: ', error);
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
}