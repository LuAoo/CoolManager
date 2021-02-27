var version = 2, DBname = 'studentSystemDB';
openDB(version, DBname);
function openDB(version, DBname) {
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
            var objectStore = db.createObjectStore('studentinfo', { keyPath: 'stunum' });
            // 创建索引值，其单个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
            objectStore.createIndex('stuname', 'stuname', { unique: false });
            objectStore.createIndex('stupassword', 'stupassword', { unique: false });
        }

        /* 教师表 */
        if (!db.objectStoreNames.contains('teachertable')) {
            // 自动生成主键
            var objectStore = db.createObjectStore('teachertable', { keyPath: 'teachnum' });
            // objectStore = db.createObjectStore('person', { autoIncrement: true });
            objectStore.createIndex('teachname', 'teachname', { unique: false });
            objectStore.createIndex('teachpassword', 'teachpassword', { unique: false });
            objectStore.createIndex('teachclass', 'teachclass', { unique: false });
        }

        /* 作业表 */
        if (!db.objectStoreNames.contains('homeworkinfotable')) {
            // 自动生成主键
            var objectStore = db.createObjectStore('homeworkinfotable', { keyPath: 'homeworkname' });
            objectStore.createIndex('homeworkneed', 'homeworkneed', { unique: false });
            objectStore.createIndex('homeworkteacher', 'homeworkteacher', { unique: false });
            objectStore.createIndex('homeworkclass', 'homeworkclass', { unique: false });
            objectStore.createIndex('homeworksenddata', 'homeworksenddata', { unique: false });
        }

        /* 学生作业提交表*/
        if (!db.objectStoreNames.contains('homeworkinputtable')) {
            // 自动生成主键
            objectStore = db.createObjectStore('homeworkinputtable', {
                keyPath: 'Id',
                autoIncrement: true
            });
            objectStore.createIndex('stuname', 'stuname', { unique: false });
            objectStore.createIndex('homeworkname', 'homeworkname', { unique: false });
            objectStore.createIndex('homeworkscore', 'homeworkscore', { unique: false });
            objectStore.createIndex('homeworkclass', 'homeworkclass', { unique: false });
            objectStore.createIndex('homeworkfinishdata', 'homeworkfinishdata', { unique: false });
            /* 新建提交内容 */
            objectStore.createIndex('homeworkcontent', 'homeworkcontent', { unique: false });
            /* 新建一个（学生姓名+作业名）的索引来查找flag(是否完成作业)*/
            objectStore.createIndex('flag',['stuname', 'homeworkname'], { unique: false });
             /* 新建一个（学生姓名+作业名）的索引来查找flag2(是否批改)*/
            objectStore.createIndex('flag2',['stuname', 'homeworkname'], { unique: false });
            
        }
        /* 学生单科成绩(双索引查找单科成绩姓名+课程名) */
        if (!db.objectStoreNames.contains('studentsinglescoretable')) {
            // 自动生成主键
            objectStore = db.createObjectStore('studentsinglescoretable', {
                keyPath: 'Id',
                autoIncrement: true
            });
            objectStore.createIndex('ScoreAdd', 'ScoreAdd', { unique: false });
            objectStore.createIndex('ScoreTest', 'ScoreTest', { unique: false });
            objectStore.createIndex('Scorehome', 'Scorehome', { unique: false });
            objectStore.createIndex('ScoreKaoqin', 'ScoreKaoqin', { unique: false });
            objectStore.createIndex('classname', 'classname', { unique: false });
            objectStore.createIndex('stuname', ['stuname', 'classname'], { unique: false });
        }
    }
}