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

const Path = {
    top:"/",
    categorys:{
        register:"/categorys/register",
        update:"/categorys/update"
    },
    cart:{
        info:"/cart/info",
        add:"/cart/add",
        init:"/cart/init",
        update:"/cart/update"
    }
}

const JsonFile = {
    categorys:"./categorys.json",
    cart:"./cart.json"
}


app.get(Path.top,(req,res) => {
    console.info("hello")
})

/**
 * カテゴリー一覧を取得する。
 */
app.get(Path.categorys.register,(req, res) => {
    let categorys = JSON.parse(fs.readFileSync(JsonFile.categorys, 'utf8'));
    console.info(categorys["categorys"]);
    res.json(categorys["categorys"]);
})

/**
 * カテゴリー一覧を更新する
 */
app.post(Path.categorys.update,(req,res) => {
    let reqBody = req.body;
    let categorys = {
        "categorys":reqBody
    };

    fs.writeFileSync(JsonFile.categorys, JSON.stringify(categorys));
    res.json({"message":"成功しました"});
})

/**
 * カートに追加する
 */
app.post(Path.cart.add,(req,res) => {
    console.info(req);
    let reqBody = req.body;
    try{
        let cartJson = JSON.parse(fs.readFileSync(JsonFile.cart));
        cartJson[reqBody.itemId] = reqBody;
        fs.writeFileSync(cartJson);
        
        let newCartJson = JSON.parse(fs.readFileSync(JsonFile.cart));
        res.json({"message":newCartJson});
    } catch(error){
        throw new Error(error.message);
    }
});

/**
 * カート情報を更新する
 */

app.post(Path.cart.update,(req,res) => {
    console.info("カート情報更新",req);
    let reqBody = req.body;
    try{
        fs.writeFileSync(JsonFile.cart,JSON.stringify(reqBody));
        res.json({"message":"カート情報の更新に成功しました"});
    } catch(error){
        console.error("カート情報更新失敗")
        console.error(error);
        throw new Error(error.message);
    }
})

/**
 * カート情報を取得する
 */
app.get(Path.cart.info,(req,res) => {
    //カート情報
    let cartInfo = JSON.parse(fs.readFileSync(JsonFile.cart));
    let response = {
        "cartInfo":cartInfo,
        "message":"成功しました"
    }
    res.json(response);
})

/**
 * カートを初期化する
 */
app.post(Path.cart.init,(req,res) => {
    fs.writeFileSync(JsonFile.cart, JSON.stringify({}));
    console.info(JSON.parse(fs.readFileSync(JsonFile.cart)));
    res.json({"message":"成功しました"});
})