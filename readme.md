### 專案教學
1. npm i (請注意package.json內使用node版本)
2. npm start 啟動 Express 後端程式
3. 我包好docker後會再上傳一版，或者有餘裕可以自行研究看看
4. npm start 後就可以開始呼叫現有API以及自己製作API

#### 啟動後可如下呼叫現有的API取得googlesheet資料表

```javascript
// 目前只有一個SheetID，以個SheetID就是一個Excel大檔案
const sheetID = '1WvnyaR9E9Aefab02Bwnx5rs-1FGPfSjBcFs8Xbd2P1Y';

// 一個range就是隸屬於SheetID之下，range可以是底下的整個工作表名稱，也可以是工作表裡面的特定範圍
const range = 'managerList';

//取得該Excel檔案內的managerList工作表全部資料
fetch(`http://localhost:3000/sheet/getdata?sheetID=${sheetID}&range=${range}`,{
    method: 'GET'
}).then(res=>{
    console.log(res);
});

//更新該Excel檔案內的eplyList工作表特定範圍資料
fetch(`http://localhost:3000/sheet/updatedata`,{
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        sheetID,
        range: '\'eplyList\'!A2:C2',
        valueInputOpt: 1,
        values: [
            ["apple", "apple2", "apple3"]
        ]
    })
}).then(res=>{
    console.log(res);
});
```

### API 的建立範例在 /route 資料夾下
1. 還看不懂程式沒關係，先知道怎麼建立API就好 
2. 建立的 API 事實上是一條一條的 URL，如同過去我們在足球專案使用 .net core建立的後端 API 一樣
3. 所以可以看到我們上面 fetch 的就是 特定的 url
4. 在 /route 底下建立好分門別類的資料夾開發完該類別的API後，必須至app.js裡面引入 (=== Enable API Route List ===)

### 如何使用logging機制
1. 目前有以下兩種主體 + 附加體(決定輸出格式)可交互使用 
2. 主體: logger.info || logger.error 
3. 附加體: normalLoggerFormat || requestLoggerFormat 
4. 前者附加體可隨意傳入訊息 Ex: 

```javascript
logger.error(normalLoggerFormat('[Final Trigger]'));
logger.info(normalLoggerFormat(
    JSON.stringify({
        sheetID,
        range,
        valueInputOpt,
        values
    })
));
logger.info(normalLoggerFormat(
    `檢查ID=${strID}`
));
```

5. 後者則是固定如下，大多數都是用前者，後者我已經把需要的地方都配好了
```javascript
logger.error(requestLoggerFormat(req, res));
```

6. logging 的檔案會愈來愈大，之後需要再做優化，比如說檔案大小超過1mb後要開始堆積在新檔案。 

### 之後有需要再補上，googlesheet我有放參考連結在sheet.js，目前有取得 + 更新的方法應該已經可以做為一個小型資料庫，只要把整張table撈出來就可在前端filter出想要的資料，缺點是沒辦法透過SQL直接取得

