/* 获取登录页面传过来的值 */
var stunum = $.query.get('stunum') + '';
var stuname = '';
var version = 2, DBname = 'studentSystemDB';
insertteacherInfo();//初始化
MyhomeWorkDataJob();//我的作业
/* 业务操作 */
/* 初始化数据 */
function insertteacherInfo() {
  findDataByDB('studentinfo', function (e) {
    stuname = e.stuname;
    $('#dLabel').html(stuname + '同学');
    SerachStudentInfo(stuname);
  });
}
/* 我的作业逻辑 */
function MyhomeWorkDataJob() {
  // 获得回调数据
  QueryTableByDB('homeworkinfotable', function (e) {
    var name = e.value.homeworkname;
    var need = e.value.homeworkneed;
    var flag = '未交';
    var homeclass = e.value.homeworkclass;
    var teacher = e.value.homeworkteacher;
    var data = e.value.homeworksenddata;
    var str = '<div class="col-sm-6 col-md-4" id="' + name + '">' +
      '<div class="thumbnail">' +
      '<div class="caption">' +
      ' <h4>' + homeclass + '作业' + '</h4>' +
      '<p><strong>状态:</strong></p>' +
      '<p><strong>代课老师:</strong>:' + teacher + '</p>' +
      '<p><strong>发布时间:</strong>' + data + '</p>' +
      '<p class=""><a href="#" class="btn btn-primary" role="button" data-toggle="modal"' +
      ' data-target="#myhomeModal" onclick="doTheHomeWork(&quot;' + name + '&quot;,&quot;' + need + '&quot;,&quot;' + homeclass + '&quot;,&quot;' + teacher + '&quot;,&quot;' + data + '&quot;);">做作业</a></p>' +
      '</div>' +
      '</div>' +
      '</div>'
    $('#homeworkinfo_list').append(str);
    // 标志颜色
    $('#' + name + ' p>strong').css('color', 'black');

    // 获得该学生在该条作业的完成情况（若没有值则说明没有完成，若完成flag值为’完成‘）
    // console.log(stuname);
    findflagbyindex(stuname, name, function (result) {
      if (result) {
        flag = result.flag;
        $('#' + name + ' h4+p').text(flag);
        $('#' + name + ' h4+p').css('color', 'green');
        $('#' + name + ' 	[role="button"]').addClass('disabled');
      } else {
        flag = '未交';
        $('#' + name + ' h4+p').text(flag);
        $('#' + name + ' h4+p').css('color', 'red');
      }
    });
  });
}

// 做作业
function doTheHomeWork(homeworkname, need, homeclass, teacher, teacherdata) {
  $('#finish_myModaltitle').text('题目:' + homeworkname);
  $('#finish_myModalcontent').attr("placeholder", need);
  $('#finishhomeworkbutton').click(function (e) {
    var myDate = new Date;
    var nowdata = myDate.getFullYear() + "年" + (myDate.getMonth() + 1) + "月" + myDate.getDate() + "日" + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
    console.log('homeworkinputtable', stuname, homeworkname, homeclass);
    content = $.trim($('#finish_myModalcontent').val());
    if (content == '') {
      $(function () {
        $('[data-toggle="popover"]').popover()
      })
    } else {
      console.log(stuname);
      insertDataToDB('homeworkinputtable', stuname, homeworkname, homeclass, nowdata, content);
      $(this).popover('destroy')
      closemodel('#mysendhomework');
    }
  });
}




/* 显示成绩 */
function SerachStudentInfo(name) {
  adddata(name,'软件工程','#score1','#score2','#score3','#score4');
  adddata(name,'C语言程序设计','#score5','#score6','#score7','#score8');
  adddata(name,'数据结构','#score9','#score10','#score11','#score12');
  adddata(name,'数据库SQL Server','#score13','#score14','#score15','#score16');
  adddata(name,'Android应用程序开发','#score17','#score18','#score19','#score20');
}
/* 放置数据 */
function adddata(stuname,classname,id1,id2,id3,id4) {
  findscorebyindex(stuname,classname, function (e) {
    if (e) {
      ScoreAdd = e.ScoreAdd;
      ScoreTest = e.ScoreTest;
      Scorehome = e.Scorehome;
      ScoreKaoqin = e.ScoreKaoqin;
      $(id1).text(ScoreAdd+'');
      $(id2).text(ScoreTest+'');
      $(id3).text(Scorehome+'');
      $(id4).text(ScoreKaoqin+'');
    } else {
      $(id1).text('暂无记录');
      $(id2).text('暂无记录');
      $(id3).text('暂无记录');
      $(id4).text('暂无记录');
    }
  });
}

/* 关闭模态框（并且清理input内容） */
function closemodel(modelid) {
  $(modelid).modal('hide');
  $(modelid + ' input').val('');
}




/* 工具函数 */
/* 查找数据工具类函数回调*/
function findDataByDB(tablename, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 拿到数据库实例
    db = openDB.result;
    var transaction = db.transaction([tablename]);
    var objectStore = transaction.objectStore(tablename);
    var request = objectStore.get(stunum);
    request.onsuccess = function (e) {
      if (request.result) {
        // 函数回调
        callback.call(this, request.result);
      }
    }
    request.onerror = function (e) {
      console.log('事务失败');
    }
  }
}
/* 遍历数据工具类函数回调*/
function QueryTableByDB(tablename, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var objectStore = db.transaction(tablename).objectStore(tablename);
    objectStore.openCursor().onsuccess = function (e) {
      var curror = e.target.result;
      if (curror) {
        // 回调操作
        callback.call(this, curror);
        // 继续检索
        curror.continue();
      } else {
        console.log('遍历结束');
      }
    }
  }
}
/* 数据库处理操作 */
/* 向数据库添加数据 */
function insertDataToDB(tablename, value1, value2, value3, value4, value5) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  var value;
  if (tablename == 'homeworkinputtable') {
    value = {
      stuname: value1,
      homeworkname: value2,
      homeworkclass: value3,
      homeworkfinishdata: value4,
      homeworkcontent: value5,
      flag: '已交',
    };
  }
  openDB.onsuccess = function (e) {
    db = openDB.result;
    var request = db.transaction([tablename], 'readwrite')
      .objectStore(tablename)
      .add(value);
    request.onsuccess = function (e) {
      if (tablename == 'homeworkinputtable') {
        alert('提交成功');
        window.location.reload();
      }
    }
    request.onerror = function (e) {
      if (tablename == 'homeworkinputtable') {
        alert('提交失败）');
      }
    }
  }
}
/* 查找flag操作 */
function findflagbyindex(stuname, homeworkname, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var transaction = db.transaction(['homeworkinputtable'], 'readonly');
    var store = transaction.objectStore('homeworkinputtable');
    var index = store.index('flag');
    var request = index.get([stuname, homeworkname]);
    request.onsuccess = function (e) {
      var result = e.target.result;
      callback.call(this, result);
    }
  }
}

// /* 双索引查找成绩表信息 */
// function findscorebyindex2(name, classname, callback) {
//   var openDB = indexedDB.open(DBname, version);
//   var db;
//   openDB.onsuccess = function (e) {
//     // 获取数据库实例
//     db = openDB.result;
//     var transaction = db.transaction(['studentsinglescoretable'], 'readonly');
//     var store = transaction.objectStore('studentsinglescoretable');
//     var index = store.index('stuname');
//     var request = index.get([name, classname]);
//     request.onsuccess = function (e) {
//       var result = e.target.result;
//       callback.call(this, result);
//     }
//   }
// }


/* 遍历(学生提交作业记录表)数据工具类函数回调（游标与index结合遍历）*/
function QueryTableByDB2(indexname, namecontent, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var objectStore = db.transaction('studentsinglescoretable').objectStore('studentsinglescoretable');
    var index = objectStore.index(indexname);
    var request = index.openCursor(IDBKeyRange.only(namecontent));
    request.onsuccess = function (e) {
      var cursor = e.target.result;
      callback.call(this, cursor);
    }
  }
}
function findscorebyindex(name, classname, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var transaction = db.transaction(['studentsinglescoretable'], 'readonly');
    var store = transaction.objectStore('studentsinglescoretable');
    var index = store.index('stuname');
    var request = index.get([name, classname]);
    request.onsuccess = function (e) {
      var result = e.target.result;
      callback.call(this, result);
    }
  }
}