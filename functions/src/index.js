// 각종 모듈 require
const functions = require('firebase-functions');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const hpp = require('hpp');
const helmet = require('helmet');
const indexRouter = require('./router');
const { sequelize } = require('./models');

const schedule = require('node-schedule');
var cron = require('node-cron');

const dattte = new Date(Date.now() + 5000);
const job = schedule.scheduleJob(dattte, () => {
  console.log('🚀🚀🚀🚀🚀🚀🚀🚀짠');
});
job;

const Agenda = require('agenda');
const mongoConnectionString = 'mongodb://127.0.0.1:27017/zanzan';
const mongoose = require('mongoose');
mongoose.connect(mongoConnectionString);
const db = mongoose.connection;
db.on('open', () => console.log('✅ DB Connect'));

const agenda = new Agenda({ db: { address: mongoConnectionString } });

const moment = require('moment');
try {
  agenda.on('ready', () => {
    console.log('Success agenda connecting');
    agenda.define('First', async (job, done) => {
      console.log('10분 마다 실행');
      console.log('!!!');
      done();
    });

    (async () => {
      // IIFE to give access to async/await
      await agenda.start();
      //해당하는 유저들 아이디 찾아서 걔네한테 보내야하는데
      //Db조회
      //sequelize--> ?눈물광광
      //postgres -> firebase 그 뭐야 많은 crud요청
      //ec2, docker 알림, mongo ->
      //유저 [0,1,2] [1,2]->점저
      //사용자 직접 입력 시간..근데 이건 자기가 쓴 멘트 보내
      //post 1: [;넌 최고야, '202-13032-3']
      //postgres row값 1 mongo, userId
      //mongo를 토해 api(get /:userid/:postid)
      //postgres조회를 해서 사용자한테 post 알림을 보내는거지 (axios post /:userid/:postid로 post쓴거)
      //메인에서 만약에 post를 확인한다고 치면 get /:user/:post
      //3개를 미리 써놓고 알림이 올 때마다key-> client에서 알아서 그 키값에 따른 포스트를 잠금해제 해놓는 느낌
      //우영님이랑 연락하세요,,,ㅠㅠ
      //정아님이랑,,친하면 물어봐줘,,,우리의 절망을,,
      //오늘 안 가능????????????????????????????????
      //토일 당신의 주간이라 바빠서 까먹을 게 분명

      //사용자들의 시간선택에 따라 3번 -> 3개를 미리 보내
      //멘트, 녹음 주소,, 유저정보 싹 다 몽고에

      console.log('왜 안대');
      agenda.schedule('every 3 seconds', 'First');
    })();
  });
} catch (err) {
  console.error(err);
  process.exit(-1);
}

// initializing
dotenv.config();
const app = express();
const logger = morgan('dev');

// /**DB 관련 */
// // 시퀄라이즈 연결
// sequelize
//   .authenticate()
//   .then(async () => {
//     console.log('✅ Connect PostgreSQL');
//   })
//   .catch((err) => {
//     console.log('TT : ', err);
//   });

// // 시퀄라이즈 모델 DB에 싱크
// sequelize
//   .sync({ alert: true })
//   .then(() => {
//     console.log('✅ Sync Models to DB');
//   })
//   .catch((err) => {
//     console.log('❌ DB ERROR:', err);
//   });

//  보안을 위한 미들웨어들
//  process.env.NODE_ENV는 배포된 서버에서는 'production'으로, 로컬에서 돌아가는 서버에서는 'development'로 고정됨.
if (process.env.NODE_ENV === 'production') {
  app.use(hpp());
  app.use(helmet());
}

app.use(cors());
app.use(logger);
// request에 담긴 정보를 json 형태로 파싱하기 위한 미들웨어들
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 라우팅: routes 폴더로 관리
app.use('/', indexRouter);

//  route 폴더에 우리가 지정할 경로가 아닌 다른 경로로 요청이 올 경우,
//  잘못된 경로로 요청이 들어왔다는 메시지를 클라이언트에 보냄
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: '잘못된 경로입니다.',
  });
});

// express를 firebase functions로 감싸주는 코드
module.exports = functions
  .runWith({
    timeoutSeconds: 300, // 요청을 처리하는 과정이 300초를 초과하면 타임아웃 시키기
    memory: '512MB', // 서버에 할당되는 메모리
  })
  .region('asia-northeast3') // 서버가 돌아갈 region. asia-northeast3는 서울
  .https.onRequest(async (req, res) => {
    // 들어오는 요청에 대한 로그를 콘솔에 찍기. 디버깅 때 유용하게 쓰일 예정.
    // 콘솔에 찍고 싶은 내용을 원하는 대로 추가하면 됨. (req.headers, req.query 등)
    console.log(
      '\n\n',
      '[api]',
      `[${req.method.toUpperCase()}]`,
      req.originalUrl,
      `[${req.method}] ${!!req.user ? `${req.user.id}` : ``} ${req.originalUrl}\n ${!!req.query && `query: ${JSON.stringify(req.query)}`} ${!!req.body && `body: ${JSON.stringify(req.body)}`} ${
        !!req.params && `params ${JSON.stringify(req.params)}`
      }`,
    );

    // 맨 위에 선언된 express app 객체를 리턴.
    // 요것이 functions/index.js 안의 api: require("./api")에 들어가는 것.
    return app(req, res);
  });
