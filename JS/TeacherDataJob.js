/* 获取登录页面传过来的值 */
var teachnum = $.query.get('teachnum') + '';
var version = 2, DBname = 'studentSystemDB';
insertteacherInfo();//初始化数据操作入口
sendhomework();//发布作业操作操作入口
/* 业务操作 */
/* 初始化数据入口 */
function insertteacherInfo() {
  findDataByDB('teachertable', function (e) {
    var teachname = e.teachname;
    var teachclass = e.teachclass
    $('#dLabel').html(teachname + '老师');
    correctHomeWork(teachclass);//批改作业操作入口
    StudentManage(teachclass);//学生管理操作入口
    SerachStudent(teachclass);//搜索学生
  });
}


/* 搜索学生入口 */
function SerachStudent(teachclass) {
  $('#manager_serach').click(function (e) {
    var content1 = $.trim($('#aa_name').val());
    var content2 = $.trim($('#aa_uid').val());
    if (content1 == '' || content2 == '' ) {
      alert('请补全成绩信息');
    } else {
      // 将成绩入库
      console.log(content1,content2);
      findscorebyindex(content1, teachclass, function (result) {
        if (result) {
          var ScoreAdd = result.ScoreAdd;
          var ScoreTest = result.ScoreTest;
          var Scorehome = result.Scorehome;
          var ScoreKaoqin = result.ScoreKaoqin;
          $('#manager_classname').text(teachclass);
          $('#manager_value1').text(ScoreTest);
          $('#manager_value2').text(Scorehome);
          $('#manager_value3').text(ScoreKaoqin);
          $('#manager_value4').text(ScoreAdd);
        } else {
          $('#manager_classname').text(teachclass);
          $('#manager_value1').text('暂无成绩记录');
          $('#manager_value2').text('暂无成绩记录');
          $('#manager_value3').text('暂无成绩记录');
          $('#manager_value4').text('暂无成绩记录');
        }
      });
      $(this).popover('destroy')
      closemodel('#setoradd');
    }
  });
}





/* 发布操作入口 */
function sendhomework() {
  var name = '';
  var need = '';
  // 获取当前时间
  var myDate = new Date;
  var homeworksenddata = myDate.getFullYear() + "年" + (myDate.getMonth() + 1) + "月" + myDate.getDate() + "日" + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
  $('#sendhomeworkbutton').click(function () {
    name = $.trim($('#sendhomework_addname').val());
    need = $.trim($('#sendhomework_addneed').val());
    if (name == '' || need == '') {
      $(function () {
        $('[data-toggle="popover"]').popover()
      })
    } else {
      findDataByDB('teachertable', function (e) {
        insertDataToDB('homeworkinfotable', name, need, e.teachname, e.teachclass, homeworksenddata);
        $(this).popover('destroy')
        closemodel('#mysendhomework');
      });
    }
  });
}

/* 批改作业操作入口*/
function correctHomeWork(value) {
  QueryTableByDB('homeworkinputtable', 'homeworkclass', value, function (e) {
    if (e) {
      Id = e.value.Id;
      studentname = e.value.stuname;
      homeworkname = e.value.homeworkname;
      homeworkscore = e.value.homeworkscore;
      homeworkclass = e.value.homeworkclass;
      homeworkfinishdata = e.value.homeworkfinishdata;
      homeworkcontent = e.value.homeworkcontent;
      flag1 = e.value.flag;
      flag2 = e.value.flag2;
      var str = '<div class="col-sm-6 col-md-4" id="' + Id + '">' +
        '<div class="thumbnail">' +
        '<div class="caption">' +
        ' <h3>' + '提交人:' + studentname + '</h3>' +
        '<p><strong>状态:</strong></p>' +
        '<p class="Pigaihomework_name"><strong>作业名称:</strong>:' + homeworkname + '</p>' +
        '<p><strong>提交时间:</strong>' + homeworkfinishdata + '</p>' +
        '<p class=""><a href="#" class="btn btn-primary" role="button" data-toggle="modal"' +
        ' data-target="#checkhomeworkinfo" onclick="teacherDoSomeThing(&quot;' + Id + '&quot;,&quot;' + studentname + '&quot;,&quot;' + homeworkname + '&quot;,&quot;' + homeworkclass + '&quot;,&quot;' + homeworkfinishdata + '&quot;,&quot;' + homeworkcontent + '&quot;,&quot;' + flag1 + '&quot;);">批改</a></p>' +
        '</div>' +
        '</div>' +
        '</div>'
      $('#teacherhomework_list').append(str);
      $('#' + Id + ' p>strong').css('color', 'black');
      // console.log(flag2);
      if (flag2 == '已批改') {
        $('#' + Id + ' h3+p').text(flag2);
        $('#' + Id + ' h3+p').css('color', 'green');
        $('#' + Id + ' 	[role="button"]').addClass('disabled');
      } else {
        $('#' + Id + ' h3+p').text('未批改');
        $('#' + Id + ' h3+p').css('color', 'red');
      }
      e.continue();
    } else {
      // console.log('暂无记录');
    }
  });
}
/* 批改作业操作入口----->批改按钮操作（打开模态框进行批改具体过程） */
function teacherDoSomeThing(value1, value2, value3, value4, value5, value6, value7) {
  $('#teacherCheckHomework_title').text('题目:' + value3);
  $('#teacherCheckHomework_content').text(value6);
  $('#teacherCheckHomework_ok').click(function (e) {
    content = $.trim($('#teacherCheckHomework_score').val());
    if (content == '') {
      alert('请输入作业成绩');
    } else {
      updataDataToDB('homeworkinputtable', value1, value2, value3, value4, value5, value6, value7, content);
      $(this).popover('destroy')
      closemodel('#mysendhomework');
    }
  });
}


/* 学生管理操作入口 */
function StudentManage(teachclass) {
  var sum = 0;//序号
  QueryStudentInfoByDb('studentinfo', function (e) {
    stunum = e.value.stunum;
    stuname = e.value.stuname;
    stupassword = e.value.stupassword;
    sum += 1;
    console.log(stunum, stuname, stupassword, sum);
    var str = '<tr>' +
      '<th scope="row">' + sum + '</th>' +
      '<td>' + stuname + '</td>' +
      '<td>' + stunum + '</td>' +
      ' <td> <button type="button" class="btn  bg-primary" data-toggle="modal"  data-target="#search"  onclick="Model_cheackStudentScore(&quot;' + stuname + '&quot;,&quot;' + teachclass + '&quot;);">查询</button></td>' +
      ' <td class="text-center"> <button type="button" class="btn btn-primary"  data-toggle="modal" data-target="#setoradd"  onclick="Model_addStudentScore(&quot;' + stuname + '&quot;,&quot;' + teachclass + '&quot;);">录入</button></td>' +
      '</tr>'
    $('#manager_querystudentinfo').append(str);
  });
}
/* 学生管理操作入口----->查询单科成绩 */
function Model_cheackStudentScore(stuname, teachclass) {
  findscorebyindex(stuname, teachclass, function (result) {
    if (result) {
      var ScoreAdd = result.ScoreAdd;
      var ScoreTest = result.ScoreTest;
      var Scorehome = result.Scorehome;
      var ScoreKaoqin = result.ScoreKaoqin;
      $('#manager_classname').text(teachclass);
      $('#manager_value1').text(ScoreTest);
      $('#manager_value2').text(Scorehome);
      $('#manager_value3').text(ScoreKaoqin);
      $('#manager_value4').text(ScoreAdd);
    } else {
      $('#manager_classname').text(teachclass);
      $('#manager_value1').text('暂无成绩记录');
      $('#manager_value2').text('暂无成绩记录');
      $('#manager_value3').text('暂无成绩记录');
      $('#manager_value4').text('暂无成绩记录');
    }
  });
}



/* 学生管理操作入口----->录入单科成绩 */
function Model_addStudentScore(stuname, teachclass){
  $('#manage_aaaddscoreOK').click(function (e) {
    console.log(e);
    var content1 = $.trim($('#manage_addscore1').val());
    var content2 = $.trim($('#manage_addscore2').val());
    var content3 = $.trim($('#manage_addscore3').val());
    if (content1 == '' || content2 == '' || content3 == '') {
      alert('请补全成绩信息');
      $(this).popover('destroy')
      closemodel('#setoradd');
      $("#manage_aaaddscoreOK").unbind('click');
    } else {
      // 将成绩入库
     console.log(content1,content2,content3);
      var Add = parseInt(content1) * 0.6 + parseInt(content2) * 0.2 + parseInt(content3) * 0.2;
      console.log(stuname);
      insertDataToDB('studentsinglescoretable', Add, content1, content2, content3, teachclass, stuname);
      $("#manage_aaaddscoreOK").unbind('click');
      $(this).popover('destroy')
      closemodel('#setoradd');
    }
  });
  $('#manage_addscoreClose').click(function () {
    closemodel('#setoradd');
  });
  // console.log(stuname);
  // 首先查找看模态框内是否va有值（实则查看数据库内是否有数据）
  findscorebyindex(stuname, teachclass, function (result) {
    // console.log(stuname);
    var tempname=stuname;
    if (result) {
      // 如果此学生有成绩，则将成绩显示出，且禁用相关控件
      $('#manage_message').text('学生成绩已提交过,您不能再次提交');
      $('#manage_message').css('color', 'green');
      var ScoreTest = result.ScoreTest;
      var Scorehome = result.Scorehome;
      var ScoreKaoqin = result.ScoreKaoqin;
      console.log(stuname, ScoreTest, Scorehome, ScoreKaoqin);
      $('#manage_addscore1').val(ScoreTest);
      $('#manage_addscore2').val(Scorehome);
      $('#manage_addscore3').val(ScoreKaoqin);
      $('#manage_aaaddscoreOK').attr('disabled', "true");
    } else {
      // 如果无值，则录入成绩
      //  计算作业平均值成绩（通过学生，课程遍历查找）
      $('#manage_addscore1').val('');
      $('#manage_addscore2').val('');
      $('#manage_addscore3').val('');
      $('#manage_aaaddscoreOK').removeAttr("disabled");//可用
      // 判断老师是否批改完作业
      QueryTableByDB('homeworkinputtable', 'stuname', stuname, function (cursor) {
        console.log('只能怪');
        if (cursor.value.homeworkclass == teachclass) {
          if (cursor.value.hasOwnProperty('homeworkscore')) {
            console.log(cursor.value.homeworkscore);
            cursor.continue();
            console.log('执行1');
          } else {
            console.log('执行2');
            $('#manage_message').text('该生的作业未批改完,不能获取作业成绩!');
            $('#manage_message').css('color', 'red');
            $('#manage_aaaddscoreOK').attr('disabled', "true");
          }
        }
      });
      $('#manage_message').text('请输入学生的剩余成绩,进行录入操作');
      $('#manage_message').css('color', 'purple');
    }
  });
}
/* 关闭模态框（并且清理input内容） */
function closemodel(modelid) {
  $(modelid).modal('hide');
  $(modelid + ' input').val('');
  $('#manage_message').text('');
}


















/* 数据库处理操作 */
/* 向数据库添加数据 */
function insertDataToDB(tablename, value1, value2, value3, value4, value5, value6) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  var value;
  if (tablename == 'homeworkinfotable') {
    value = {
      homeworkname: value1,
      homeworkneed: value2,
      homeworkteacher: value3,
      homeworkclass: value4,
      homeworksenddata: value5,
    };
  } else if (tablename == 'studentsinglescoretable') {
    value = {
      ScoreAdd: value1,
      ScoreTest: value2,
      Scorehome: value3,
      ScoreKaoqin: value4,
      classname: value5,
      stuname: value6,
    };
  }
  openDB.onsuccess = function (e) {
    db = openDB.result;
    var request = db.transaction([tablename], 'readwrite')
      .objectStore(tablename)
      .add(value);
    request.onsuccess = function (e) {
      if (tablename == 'homeworkinfotable') {
        alert('成功发布作业');
      }
      if (tablename == 'studentsinglescoretable') {
        alert('成功录入');
      }
    }
    request.onerror = function (e) {
      if (tablename == 'homeworkinfotable') {
        alert('作业发布失败）');
      }
      if (tablename == 'studentsinglescoretable') {
        alert('录入失败');
      }
    }
  }
}
/* 查找数据工具类函数回调(查找某条数据)*/
function findDataByDB(tablename, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    db = openDB.result;
    var transaction = db.transaction([tablename]);
    var objectStore = transaction.objectStore(tablename);
    var request = objectStore.get(teachnum);
    request.onsuccess = function (e) {
      if (request.result) {
        callback.call(this, request.result);
      }
    }
    request.onerror = function (e) {
      console.log('事务失败');
    }
  }
}


/* 更新数据 */
function updataDataToDB(tablename, value1, value2, value3, value4, value5, value6, value7, homeworkscore) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var request = db.transaction([tablename], 'readwrite')
      .objectStore(tablename)
      .put({
        Id: parseInt(value1),
        stuname: value2,
        homeworkname: value3,
        homeworkscore: homeworkscore,
        homeworkclass: value4,
        homeworkfinishdata: value5,
        homeworkcontent: value6,
        flag: value7,
        flag2: '已批改',
      });
    request.onsuccess = function (e) {
      alert('批改成功');
      window.location.reload();
    }
    request.onerror = function (e) {
      console.log('更新失败');
    }
  }
}

/* 遍历(学生提交作业记录表)数据工具类函数回调（游标与index结合遍历）*/
function QueryTableByDB(tablename, indexname, teachclass, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var objectStore = db.transaction(tablename).objectStore(tablename);
    var index = objectStore.index(indexname);
    var request = index.openCursor(IDBKeyRange.only(teachclass));
    request.onsuccess = function (e) {
      var cursor = e.target.result;
      callback.call(this, cursor);
    }
  }
}
/* 遍历(学生信息表)普通遍历工具类*/
function QueryStudentInfoByDb(tablename, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var objectStore = db.transaction(tablename).objectStore(tablename);
    objectStore.openCursor().onsuccess = function (e) {
      var curror = e.target.result;
      if (curror) {
        callback.call(this, curror);
        curror.continue();
      } else {
        console.log('遍历学生信息结束');
      }
    }
  }
}



/* 查找flag操作 */
function findflagbyindex2(stuname, homeworkname, callback) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var transaction = db.transaction(['homeworkinputtable'], 'readonly');
    var store = transaction.objectStore('homeworkinputtable');
    var index = store.index('flag2');
    var request = index.get([stuname, homeworkname]);
    request.onsuccess = function (e) {
      var result = e.target.result;
      callback.call(this, result);
    }
  }
}

/* 双索引查找成绩表信息 */
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



