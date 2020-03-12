<a href="https://imgur.com/irPHp0a"><img src="https://i.imgur.com/irPHp0a.png" align="right"/></a>
# MongoDB.basic

**Table of Contents**

  * [MongoDB.basic](#MongoDB.basic)
    * [CRUD](#CRUD)
    * [Authentication](#Authentication)
    * [Export and Import](#Export-and-Import)
    * [Example](#Example)
      * [function - load](#function---load)
      * [basic - update](#basic---update)
      * [basic - delete](#basic---delete)
      * [basic - find & limit & skip](#basic---find-&-limit-&-skip)
      * [Một số toán tử thường dùng](#Một-số-toán-tử-thường-dùng)
      * [Sắp xếp](#Sắp-xếp)
    * [Index](#Index)
      * [Single Field Indexes](#Single-Field-Indexes)
      * [Compound Indexes](#Compound-Indexes)
      * [Unique Indexes](#Unique-Indexes)
      * [Sparse Indexes](#Sparse-Indexes)
      * [TTL Index](#TTL-Index)
      * [Text Index](#Text-Index)
      * [Partial Indexes](#Partial-Indexes)
    * [Bonus](#Bonus)

|   | Các từ viết tắt trong tài liệu  |
| ------------ | ------------ |
| collection_name  | cln  |
| database_name  | dbn  |
| object_json  | objson  |
| js_file  | jsfile  |
| path_file  | pathfile  |

## CRUD

Tài liệu tham khảo đầy đủ -> [Click to me](https://docs.mongodb.com/manual/reference/method/js-collection/)

*Document*

|   | Syntax  | Note |
| ------------ | ------------ | ------------ |
| Create  | db.**cln**.insert({**objson**})  | or use function load(**jsfile**)  |
| Read  | db.**cln**.find(**query**)  | .pretty() -> format  |
| Update  | db.**cln**.update( **query**, **update**, **{upsert, multi }**) | upsert -> có hay không tạo ra khi không tìm thấy, multi -> có hay không cập nhật nhiều giá trị  |
| Delete  | db.**cln**.remove( **query**, **{justOne}** )  | justOne -> có hay xóa nhiều giá trị  |

------------

*Collection*

|   | Syntax  | Note |
| ------------ | ------------ | ------------ |
| Create  | db.createCollection(**cln**)  |  |
| Read  | show collections  |   |
| Update  | db.**cln**.renameCollection(**new_cln**)  |   |
| Delete  | db.**cln**.drop()  |   |

------------

*Database*

|   | Syntax  | Note |
| ------------ | ------------ | ------------ |
| Create  | use **dbn**  |  |
| Read  | show bds  |   |
| Update  |   |   |
| Delete  | db.dropDatabase() )  |   |

## Authentication

```
mongo
use admin
db.auth("username", "password")
```

*Arguments when authentication*

    --authenticationDatabase admin -- username username --password password

## Export and Import

*Collection*

    mongoexport --db dbn --collection cln --out pathfile // export collection
    mongoimport --db dbn --collection cln --file pathfile // import collection

*Database*

> Solution 1: Không nén

    mongodump --db dbn --out "path" // với path là đường dẫn lưu file
    mongorestore --db dbn "path" // restore

> Solution 2: Nén các tập tin bên trong

    mongodump --db dbn --out "path" --gzip
    mongorestore --db dbn "path" --gzip

> Solution 3: Nén toàn bộ thư mục

    mongodump --db dbn --gzip --archive=path.gz // lưu ý đuôi gz
    mongorestore --db dbn --gzip --archive=path

## Example

Bạn có thể tải database demo [tại đây](https://github.com/ytbhoanghai/Mongodb/blob/master/Database%20Example/01.CollectionTeacher "tại đây"), sau đó tiến hành import vào mongo với câu lệnh `mongoimport --db dbn --collection teacher --file pathfile`

### function - load

Có phiền không khi nhập chuỗi json trong màn hình console? Vậy hãy xem xét file js sau và load nó vào mongo với function load(). `load("123/abc/01.Insert Object Json.js") // chú ý hướng dấu /`

```javascript
// insert one object
var teacher1 = {
    "_id" : 1,
    "name" : "Raegan Kemmer",
    "phone" : "440.057.5049 x830",
    "address" : "81515 Victoria Knoll"
};
db.teacher.insert(teacher1);

// insert multi object
var teachers = [{
    "_id" : 2,
    "name" : "Lamar Runte",
    "phone" : "1-279-337-9800",
    "address" : "3841 Maci Meadows"
},{
    "_id" : 3,
    "name" : "Evan Kling",
    "phone" : "710-680-3769 x3840",
    "address" : "7440 West Meadows"
},{
    "_id" : 4,
    "name" : "Willard Eichmann",
    "phone" : "458.318.3251 x9541",
    "address" : "333 Abagail Square"
}];
db.teacher.insert(teachers);
```

### basic - update

Danh sách các toán tử dùng trong câu truy vấn có thể tham khảo [tại đây](https://docs.mongodb.com/manual/reference/operator/query/).

*Example 1: Tìm kiếm đối tượng có id = 2 và thay đổi số điện thoại*

    db.teacher.update( {_id: 2}, {$set: {phone: '2-179-665-8895'}}, {upsert: false, multi: false}) // Hãy thử xóa $set và chạy câu truy vấn

*Example 2: Những đối tượng không có field class sẽ được cập nhật thành A1*

    db.teacher.update({class: {$exists: false}}, {$set: {class: 'A1'}}, {multi: true})

*Example 3: Những đối tượng có id lớn hơn hoặc bằng 2 và nhỏ hơn 4 sẽ được cập nhật class thành A2*

    db.teacher.update({_id: {$gte: 2, $lt: 4}}, {$set: {class: 'A2'}}, {multi: true})

*Example 4: Không có trong danh sách địa chỉ sau thì cập nhật class thành A3 ["81515 Victoria Knoll", "7440 West Meadows"]*

    db.teacher.update({address: {$nin: ["81515 Victoria Knoll", "7440 West Meadows"]}}, {$set: {class: 'A3'}}, {multi: true})

*Example 5: Để xóa 1 field trong collection ta dùng toán tử $unset*

    db.teacher.update({}, {$unset: {phone: "", class: ""}}, {multi: true})

*Chúng ta có những function thú vị sau:*
  1. db.collection.updateOne(filter, update, options) -> [reference](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne "reference")
  2. db.collection.updateMany(filter, update, options) -> [reference](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany "reference")
  3. db.collection.replaceOne(filter, update, options) -> [reference](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne "reference")

### basic - delete

Chúng ta sẽ focus thao tác này vào documents, đối với database hoặc collection xem lại mục CRUD.

*Xóa tất cả document trong collection*

    db.teacher.remove({}, {justOne: false})

*Xóa document theo tiêu chí*

    db.teacher.remove({_id: 2}, {justOne: true})

### basic - find & limit & skip

Cấu trúc câu lệnh find() `db.cln.find(filter, { field1: 0|1, field2: 0|1 ... })`

> Tham số thứ 2 cho chúng ta lựa chọn hiển thị hay không hiển thị field chỉ định với 0 là có và 1 là không hiển thị.

**find()**

    db.teacher.find({_id: {$gt: 5, $lt: 15}}, {_id: 0, name: 1, address: 1})

**limit() & skip()**

    db.teacher.find().limit(10).skip(0) // bỏ lại 0 document và lấy 10 document sau đó

> Ngoài ra chúng ta cũng có thể sử dụng function count để đếm số lượng document trả về `db.teacher.find().count()`.
Đối với những giá trị lồng, sử dụng ngoặc kép để chỉ rõ như sau: `db.teacher.find({"skills.language": "english"})`

### Một số toán tử thường dùng

| operator  | Syntax  | Note  |
| ------------ | ------------ | ------------ |
| $and  | `{$and: [{<expression1>}, {<expression2>}]}`  | Tất cả expression trả về true |
| $not  | `{field: {$not:{<operator-expression>}}}`  | phủ định của expression  |
| $or  | `{$or: [{<expression>}, {<expression2>}]}`  | Ít nhất 1 expression trả về true  |
| $nor  | `{$nor: [{<expression>}, {<expression2>}]}`  | trả về document không khớp với tất cả expression  |

Tham khảo nhanh [tại đây](https://docs.mongodb.com/manual/reference/operator/query-logical/ "tại đây")

### Sắp xếp

Syntax Example: `db.teacher.find().sort( { _id: -1 } ) // -1 -> descending  and 1 -> ascending`

## Index

Bạn có thể tải file database demo zips.json có sẵn trên mongodb [tại đây](https://github.com/ytbhoanghai/Mongodb/blob/master/Database%20Example/02.Zips.json "tại đây") để demo phần này.

> Để kiểm tra thông tin của câu truy vấn ta có thể sử dụng lệnh sau: `db.cln.find().explain("executionStats")`

### Single Field Indexes

> Trước khi thực hiện đánh index, hãy thử chạy câu lệnh sau đây và quan sát thuộc tính executionStats `db.zip.find({pop: 4564}).explain("executionStats")`, sau đó thực hiện đánh index và chạy lại câu lệnh trên để thấy sự khác biệt.

*Kiểm tra index của 1 collection với cú pháp như sau:*

    db.cln.getIndexes()
Example: `db.zip.getIndexes()`

*Tạo index với cú pháp như sau:*

    db.zip.createIndex({field: 1|-1}) // với 1 -> tăng dần, -1 -> giảm dần
Example: `db.zip.createIndex({"pop": 1})`

*Để xóa 1 index thực hiện câu lệnh sau:*

    db.cln.dropIndex("index_name") // index_name tham khảo tại db.cln.getIndexes()
Example: `db.zip.dropIndex("pop_1")`

### Compound Indexes

Create Index: `db.zip.createIndexes({state: 1, pop: 1})`

Query: `db.zip.find({state: 'MA', pop: {$lte: 21905}})`

### Unique Indexes

Để thiết lập giá trị duy nhất (không trùng) trong 1 field ta thêm option sau vào function createIndexes: `{unique: true}`

```plaintext
db.zip.update({},{$set: {secondId: UUID()}}, {multi: true}) // create field secondId
db.zip.createIndex({_id: 1, secondId: 1}, {unique: true}) // create index
```

### Sparse Indexes

> Dịch sang Tiếng Việt nó có nghĩa là "thưa thớt"

Để tăng hiệu suất truy vấn với những field mà document này có dữ liệu nhưng document khác lại không, ta thêm option sau vào function createIndexes: `{sparse: true} // giống unique index`.

*Demo 1 chút nhỉ?*
```plaintext
// Xóa field address của 1 vài document.
db.teacher.update({_id: {$gt: 15, $lt: 30}}, {$unset: {address: ""}}, {multi: true}) 

 // sắp xếp theo field address (chỉ những document có tồn tại field address) và kiểm tra câu truy vấn.
db.teacher.find({address: {$exists: true}}).sort({address: 1}).explain("executionStats")

 // tạo index có field address (Hãy nhớ, field này sparse)
db.teacher.createIndex({address: 1}, {sparse: true})

 // hãy so sánh kết quả với khi chưa tạo index với option sparse
db.teacher.find().sort({address: 1}).hint({address: 1}).explain("executionStats")
```

Bạn có thể xem kết quả [tại đây](https://i.imgur.com/m6SlMwo.png), màn hình bên trái là chưa đánh index và bên phải là đã đánh index.

### TTL Index

> TTL là từ viết tắt của Time-To-Live, chỉ định 1 số document sẽ hết hạn sau 1 khoảng thời gian cố định.

```plaintext
// Thiết lập field createdDate (type Date)
db.teacher.updateMany({_id: {$gt: 15, $lt: 30}}, {$set: {createdDate: new Date()}})

// Thiết lập TTL Index, chỉ định sau 10s những document có field createdDate sẽ bị xóa
db.teacher.createIndex({createdDate: 1}, {expireAfterSeconds: 10})
```

### Text Index

Chúng ta sẽ tạo index cho field name và address dạng text và thiết lập default_language = english như sau:

```plaintext
db.teacher.createIndex({name: 'text', address: 'text'}, {default_language: "english"})
```

Nếu có thắc mắc về default_language bạn có thể đọc tài liệu tham khảo [tại đây](https://docs.mongodb.com/manual/reference/text-search-languages/#text-search-languages). (Hãy sử dụng "none" nếu là Tiếng Việt).

Khi đó: Để tiến hành find text ta sử dụng cấu trúc câu lệnh sau: `db.teacher.find({$text: {$search: "value", $caseSensitive: true}})`.

> Các từ phân tách bằng khoảng trắng (space) có nghĩa là hoặc, để tìm kiếm theo 1 cụm từ hãy bao cụm từ đó trong dấu ngoặc kép \\"cụm từ ở đây\\", để loại từ 1 từ hoặc 1 cụm từ hãy đặt dấu - phía trước.

```plaintext
// Những document có text là Gilbert HOẶC Evan
db.teacher.find({$text: {$search: "Gilbert Evan", $caseSensitive: false}})

// Những document có text là "Evan Kling" VÀ KHÔNG CÓ TEXT "642 Maeve Route"
db.teacher.find({$text: {$search: "\"Evan Kling\" -\"642 Maeve Route\"", $caseSensitive: false}})
```
> $caseSensitive chỉ thị có hay không phân biệt hoa thường, với true là có và false là không.

### Partial Indexes

Trước khi đến với phần này, bạn có thể sử dụng database mẫu [tại đây](https://github.com/ytbhoanghai/Mongodb/blob/master/Database%20Example/03.PrimerDataset.json). Sau khi import, hãy nghĩ đến việc cập nhật tất cả các document với 3 fields sau:

| Fields       | Type    | Comments |
|--------------|---------|----------|
| phoneNumber1 | String  | số điện thoại random với 10 ký số bắt đầu với 0.|
| phoneNumber2 | Integer | chuyển đổi phoneNumber1 thành kiểu Integer.|
| customRating | Double  | rating random từ 0.0 đến 10.0 |

*Kết quả cuối cùng 1 phần sẽ như sau:*

![Imgur](https://i.imgur.com/YEBPpaD.png)

Bạn có thể dùng bất cứ cách gì như tạo ra function, tạo ra file và insert hoặc chạy trực tiếp script javascript. Hãy cố gắng, nếu không có thời gian, bạn có thể tham khảo nhanh cách của tôi [tại đây](https://github.com/ytbhoanghai/Mongodb/blob/master/Script%20Javascript/01.generateDataRandom.js), hãy sử dụng function load() để chạy script trên.

Link tài liệu tham khảo tôi để [tại đây](https://docs.mongodb.com/manual/core/index-partial/index.html), ở đó bạn có thể tìm thấy khái niệm và thêm nhiều chi tiết hơn nữa.

Bây giờ hãy thực hiện câu truy vấn sau và kiểm tra kết quả:

```plaintext
db.restaurants.find(
    {
        cuisine: "Italian",
        customRating: {$gt: 4}
    }
).explain("executionStats")
```

Nếu bộ lọc này được thực hiện với tần suất lớn, tức nhiều request tương tự với điều kiện như vậy được thực hiện ta có thể đánh index cho nó như sau:

```plaintext
db.restaurants.createIndex(
    { cuisine: 1 }, 
    { partialFilterExpression: { customRating: {$gt: 4} } }
) 
```
// Hãy chạy lại câu truy vấn và so sánh kết quả.


> Cũng vậy, đối với các truy vấn mà tập kết quả có thể là tập con của partial index trên nó cũng thừa hưởng từ việc đánh index.

Example: 

```plaintext
db.restaurants.find(
    {
        cuisine: "Italian",
        customRating: {$gt: 6}
    }
).explain("executionStats")
```


## Bonus

Có lẽ bạn đã biết cách làm sao truy cập vào 1 field của 1 đối tượng là giá trị của 1 field khác, nó trông giống như giá trị của field address là 1 object như sau:

![Imgur](https://i.imgur.com/EcO3Wto.png)

Thực hiện các câu lệnh tương tự như sau:

```plaintext
db.getCollection('restaurants').find(
    {
        "address.building": "2780"
    }
)
```

> Tôi vẫn chưa tìm ra cách để thực hiện find với bộ lọc như sau: `"address.coord": [-73.9851356, 40.7676919]`. Khi coord không lồng, nó thực hiện tốt, nhưng khi lồng nó lại không trả về kết quả, nếu bạn biết cách hãy chia sẽ cùng tôi. ^^

Bây giờ, hãy nhìn vào field grades, chúng ta có 1 mảng các đối tượng. Làm sao để thực hiện các yêu cầu truy vấn như sau:

  * Lấy ra các document có grade là "A" và score lớn hơn 12?
  * Lấy ra các document có grade là "A", score lớn hơn 12 và date trong khoảng 01/01/2014 đến 01/01/2015?
  * Lấy ra các document có grade là "C" và score lớn hơn 12 nhỏ hơn 15
  * Lấy ra các document có score lớn hơn 12 nhỏ hơn 15 và grade không có giá trị "A"?
  
*Đối với yêu cầu thứ 1, lời giải có thể là:*

  ```plaintext
db.restaurants.find(
    {
        "grades": {
            $elemMatch: {
                grade: "A",
                score: {$gt: 12}
            }
        }
    }
)
```

*Với yêu cầu thứ 2:*

```plaintext
db.restaurants.find(
    {
        "grades": {
            $elemMatch: {
                grade: "A",
                score: {$gt: 12},
                date: {$gt: new Date(2014, 0, 1), $lt: new Date(2015, 0, 1)}
            }
        }
    }
)
```

Bạn hãy thử với các yêu cầu còn lại.
