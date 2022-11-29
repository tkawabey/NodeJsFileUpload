// expressモジュールを使用する宣言を行います
const express = require("express");
// expressのインスタンスを作成
const app = express();
// リッスンを開始するポート番号
const PORT = 8000;
// express-handlebarsモジュールを使用する宣言を行います
const { engine } = require("express-handlebars");

// MySQLを使用する宣言を行う
//const mysql = require("mysql");
// MySQL8.0では、mysql2モジュールを使用します。
const mysql = require("mysql2");
// Viewのテンプレートエンジンコールバックを登録します
app.engine("handlebars", engine());
// viewエンジンは、handlebarsを使用
app.set("view engine", "handlebars");
// viewsのリアルパスの指定
app.set("views", "./views");

// express-fileuploadモジュールを使用する宣言を行います
const fileUpload = require("express-fileupload");
// fileUploadモジュールを使用するように指示しています。
app.use(fileUpload());
// 静的ファイルの参照先のディレクトリを指定しています。
// HTML側の<img src= の指定先は、./upload/img.png　ではなく、img.png　と指定します。
app.use(express.static("upload"));

// コネクションプールを作成します。
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "192.168.50.118", // MySQLがインストールされているサーバーのIPアドレスを指定します。
    port: "13306",
    user: "root",
    database: "test_db",
    password: "pwd",
  });

  // エンドポイント'/'　へのGETアクセス時の処理
app.get('/', (req, res) => {
    // MySQLコネクションポールから、コネクションを取得。
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("DBと接続中・・・");
        // SELECTクエリーを発行して、image_datasテーブルの一覧を取得します。
        connection.query("SELECT * FROM  image_datas", (err, rows) => {
            // 使用し終わったコネクションはリリースしますします
          connection.release();
          console.log(rows);
          if (!err) {
            // res.render関数をコールします。
            // 引数のhomeは、views/home.handlebars のhomeに一致します。
            // 
            res.render("home", { layout: false, rows });
          }
        });
      });
});

// エンドポイント'/'　へのPOSTアクセス時(ファイルのアップロード)の処理
app.post("/", (req, res) => {
    let sampleFile;
    let uploadPath;
  
    if (!req.files) {
      return res.status(400).send("何も画像がアップロードされていません");
    }
  
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + "/upload/" + sampleFile.name;
    console.log(sampleFile);
  
    //サーバー側のディスクにファイルを保存します。
    // uploadディレクトリは予め作成しておく必要があります。
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
  
      pool.getConnection((err, connection) => {
        if (err) throw err;
  
        console.log("DBと接続中・・・🌳");

        connection.query(
            `insert into image_datas (image_name) values ('${
            sampleFile.name
            }');`,
            (err, rows) => {
                connection.release();
                if (!err) {
                    res.redirect("/");
                } else {
                    console.log(err);
                }
            }
        );
      });      
      //res.send("ファイルをアップロードしました！");
    });
  });
  


// サーバーを指定したポートでリッスン開始します。
app.listen(PORT, () => {
    console.log("listening on 8000");
} );



