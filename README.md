# Council

## Program structure

```
├── app.js//server
├── node_modules
├── package.json
├── config.json
├── routes//根據收到的request，進入不同routes
│   ├── user
│   ├── proposal
│   └── delibration
├── models//從DB中找尋資料，對資料進行後處理
│   └── db.js
│── controller
│   ├── userr_controller.js
│   ├── proposal_controller.js
│   └── delibration_controller.js
├── assets
│   ├── css
│   ├── image
│   └── javascripts
└── views
    ├── public
    └── xxxx.ejs
```

1.	收到request後，交由特定的router的function所接收，並呼叫相對應的controller。
2.  透過相對應的controller function來呼叫特定的model做處理。
3.	若該request需要與DB來做撈取資料的動作，則從DB中找尋該資料，並將資料回傳至model中。若無則直接對資料進行後處理的動作。
4.	待model處理完資料的邏輯後，將其結果回傳至controller中。
5.  controller將資料傳給view，並由view來產生html文件。
6.	藉由controller來將view所產生的html的文件回傳response。

## controllers

Example:
```
//user_cotroller.js

var user = require('../models/user');

// Display list of all user.
exports.user_list = function(req, res) {
    res.send('NOT IMPLEMENTED: user list');
};
```