# ファイルをアップロードサイト作成。

## 使用モジュール
- express
- express-handlebars
- express-fileupload
- nodemon
- mysql
- mysql2

## MySQLをdocker上に構築
1. https://hub.docker.com/　から、MYSQLを検索して
    >docker pull mysql
   を実行して、MYSQLを取得
2. コンテナを作成して、開始する。
    docker run --name test-mysql -p 13306:3306 -e MYSQL_ROOT_PASSWORD=pwd -d mysql
    コンテナ名　test-mysql
    ポートフォワーディング　3306　を　pc側　133006へ　
    パスワード　pwd
    イメージは、先ほど取得した　mysql

    で　コンテナーを起動する
    既に作成しているコンテナーを起動する場合は、
    $docker start test-mysql
3. 起動しているコンテナーを表示
    $ docker ps

4. 起動しているコンテナーの中に入る
   $ docker exec -it test-mysql bash

5. MySQLへ入る
   $ mysql -u root -p 
　　 パスワードは、MYSQL_ROOT_PASSWORD　に指定した値

6. DB作成->テーブル作成->レコード追加
    $ CREATE DATABASE test_db;
    $ USE  test_db;
    $ CREATE TABLE image_datas (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    image_name  VARCHAR(50)
    );
    $ exit

