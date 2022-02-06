// 각종 모듈 require
const functions = require("firebase-functions");
const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const hpp = require("hpp");
const helmet = require("helmet");
const indexRouter = require("./router/indexRouter");
const { sequelize } = require('./database/models');

// initializing
dotenv.config();
const app = express();
const logger = morgan('dev');

/**DB 관련 */
    
// 시퀄라이즈 연결
sequelize.authenticate()
    .then(async () => {
        console.log("✅ Connect PostgreSQL");
    })
    .catch((err) => {
        console.log("TT : ", err);
    });

// 시퀄라이즈 모델 DB에 싱크
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Sync Models to DB');
    })
    .catch((err) => {
        console.log('❌ DB ERROR:', err);
    });

//  보안을 위한 미들웨어들
//  process.env.NODE_ENV는 배포된 서버에서는 'production'으로, 로컬에서 돌아가는 서버에서는 'development'로 고정됨.
if (process.env.NODE_ENV === "production") {
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
app.use("/", indexRouter);

//  route 폴더에 우리가 지정할 경로가 아닌 다른 경로로 요청이 올 경우,
//  잘못된 경로로 요청이 들어왔다는 메시지를 클라이언트에 보냄
app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "잘못된 경로입니다.",
  });
});

// express를 firebase functions로 감싸주는 코드
module.exports = functions
  .runWith({
    timeoutSeconds: 300, // 요청을 처리하는 과정이 300초를 초과하면 타임아웃 시키기
    memory: "512MB", // 서버에 할당되는 메모리
  })
  .region("asia-northeast3") // 서버가 돌아갈 region. asia-northeast3는 서울
  .https.onRequest(async (req, res) => {
    // 들어오는 요청에 대한 로그를 콘솔에 찍기. 디버깅 때 유용하게 쓰일 예정.
    // 콘솔에 찍고 싶은 내용을 원하는 대로 추가하면 됨. (req.headers, req.query 등)
    console.log(
      "\n\n",
      "[api]",
      `[${req.method.toUpperCase()}]`,
      req.originalUrl,
      `[${req.method}] ${!!req.user ? `${req.user.id}` : ``} ${
        req.originalUrl
      }\n ${!!req.query && `query: ${JSON.stringify(req.query)}`} ${
        !!req.body && `body: ${JSON.stringify(req.body)}`
      } ${!!req.params && `params ${JSON.stringify(req.params)}`}`
    );

    // 맨 위에 선언된 express app 객체를 리턴.
    // 요것이 functions/index.js 안의 api: require("./api")에 들어가는 것.
    return app(req, res);
  });
