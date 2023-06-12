const express = require('express');
const fs = require('fs');

const app = express();
const port = 3004;

app.listen(port, () => {
    console.info("サーバー起動中");
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/",(req,res) => {
    console.info("hello")
})

/**
 * カテゴリー一覧を取得する。
 */
app.get('/categorys/register',(req, res) => {
    let categorys = JSON.parse(fs.readFileSync('./categorys.json', 'utf8'));
    console.info(categorys["categorys"]);
    res.json(categorys["categorys"]);
})

/**
 * カテゴリー一覧を更新する
 */
app.post('/categorys/update',(req,res) => {
    let reqBody = req.body;
    let categorys = {
        "categorys":reqBody
    };

    fs.writeFileSync('./categorys.json', JSON.stringify(categorys));
    res.json({"message":"成功しました"});
})