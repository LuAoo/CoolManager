var version=2,DBname='studentSystemDB';
openDB(version,DBname);
function openDB(version,DBname) {
    var request = indexedDB.open(DBname, version);
        var db;
        request.onsuccess = function (e) {
            // 拿到数据库实例
            console.log(db);
            console.log('数据库打开成功');
        }
        request.onerror = function (e) {
            console.log('数据库打开报错');
        }
        request.onupgradeneeded = function (e) {
            // 更新时拿到数据库实例
            db = e.target.result;
            // 新建一张表(person),主键为id
            /* 学生个人信息表 */
            if (!db.objectStoreNames.contains('studentinfo')) {
                // 自动生成主键
                var objectStore=db.createObjectStore('studentinfo',{keyPath:'stunum'});
                // 创建索引值，其单个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
                objectStore.createIndex('stuname', 'stuname', { unique: false });
                objectStore.createIndex('stupassword', 'stupassword', { unique: false });
            }
            /* 学生成绩表 */
            if (!db.objectStoreNames.contains('studentscore')){
                // 自动生成主键
                var objectStore=db.createObjectStore('studentscore',{keyPath:'stunum'});
                // objectStore = db.createObjectStore('person', { autoIncrement: true });
                // 创建索引值，其单个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
                objectStore.createIndex('score1', 'score1', { unique: false });
                objectStore.createIndex('score2', 'score2', { unique: false });
                objectStore.createIndex('score3', 'score3', { unique: false });
                objectStore.createIndex('score4', 'score4', { unique: false });
                objectStore.createIndex('score5', 'score5', { unique: false });
                objectStore.createIndex('score6', 'score6', { unique: false });
                objectStore.createIndex('score7', 'score7', { unique: false });
                objectStore.createIndex('score8', 'score8', { unique: false });
            }
        }
}