var version = 2, DBname = 'studentSystemDB';
student_residentbutton();//学生注册
teacher_residentbutton();//老师注册
teacher_finder();//查找老师信息
StudentManage();
SerachStudent();

/* 搜索学生入口 */
function SerachStudent() {
  $('#admin_search_button').click(function (e) {
    var content1 = $.trim($('#admin_name').val());
    var content2 = $.trim($('#admin_uid').val());
    var content3 = $.trim($('#password-student').val());
    if (content1 == '' || content2 == ''||content3=='' ) {
      alert('请补全成绩信息');
    } else {
      $('#search').modal('show');
      admin_cheackStudentScore(content1);
    }
  });
}


/* 关闭模态框（并且清理input内容） */
function closemodel(modelid) {
  $(modelid).modal('hide');
  $(modelid + ' input').val('');
  $('#manage_message').text('');
}


/* 学生管理操作入口 */
function StudentManage(teachclass) {
  var sum = 0;//序号
  QueryStudentInfoByDb2('studentinfo', function (e) {
    stunum = e.value.stunum;
    stuname = e.value.stuname;
    stupassword = e.value.stupassword;
    sum += 1;
    console.log(stunum, stuname, stupassword, sum);
    var str = '<tr>' +
      '<th scope="row">' + sum + '</th>' +
      '<td>' + stuname + '</td>' +
      '<td>' + stunum + '</td>' +
      ' <td> <button type="button" class="btn  bg-primary" data-toggle="modal"  data-target="#search"  onclick="admin_cheackStudentScore(&quot;' + stuname + '&quot;);">查询</button></td>' +
      ' <td class="text-center"> <button type="button" class="btn btn-primary"  data-toggle="modal" data-target="#setoradd"  onclick="Model_addStudentScore(&quot;' ;
    $('#admin_querystudentinfo').append(str);
  });
}

function admin_cheackStudentScore(stuname) {
  console.log(stuname);
  adddata(stuname,'软件工程','#score1','#score2','#score3','#score4');
  adddata(stuname,'C语言程序设计','#score5','#score6','#score7','#score8');
  adddata(stuname,'数据结构','#score9','#score10','#score11','#score12');
  adddata(stuname,'数据库SQL Server','#score13','#score14','#score15','#score16');
  adddata(stuname,'Android应用程序开发','#score17','#score18','#score19','#score20');
}

/* 放置数据 */
function adddata(stuname,classname,id1,id2,id3,id4) {
  findscorebyindex2(stuname,classname, function (e) {
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


function findscorebyindex2(name, classname, callback) {
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

/* 遍历(学生信息表)普通遍历工具类*/
function QueryStudentInfoByDb2(tablename, callback) {
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



/* 数据库搜索方法*/
function searchDataToDb(indexname, stuname) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  openDB.onsuccess = function (e) {
    // 获取数据库实例
    db = openDB.result;
    var transaction = db.transaction(['studentinfo'], 'readonly');
    var store = transaction.objectStore('studentinfo');
    var index = store.index('stuname');
    var request = index.get(stuname);
    request.onsuccess = function (e) {
      var result = e.target.result;
      if (result) {
        alert('密码已找回，您的密码为：' + result.stupassword);
      } else {
        console.log('信息有误，寻找密码失败');
      }
    }
  }
}
/* 查找老师 */
function teacher_finder() {
  $('#teacher_finder').click(function () {
    inputcontent = $.trim($('#teacher_findcontent').val());
    if (inputcontent == '') {
      alert('请输入老师信息');
   }else{
    var openDB = indexedDB.open(DBname, version);
    var db;
    openDB.onsuccess = function (e) {
      db = openDB.result;
      var transaction = db.transaction(['teachertable'], 'readonly');
      var store = transaction.objectStore('teachertable');
      var request = store.get(inputcontent);
      request.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
          $('#searchteacher').modal('show');
          $('#teacher_finder1 p').html('<strong>教师姓名:</strong>'+request.result.teachname);
          $('#teacher_finder2 p').html('<strong>个人账号:</strong>'+request.result.teachnum);
          $('#teacher_finder3 p').html('<strong>所任课目:</strong>'+request.result.teachclass);
          $('#teacher_finder4 p').html('<strong>账户密码:</strong>'+request.result.teachpassword);
        } else {
          alert('信息有误，寻找密码失败');
        }
      }
    } 
   }
  });
}

/* 学生注册 */
function student_residentbutton() {
  var stunm = '';
  var stuname = '';
  var stupassword = '';
  // 确认密码文本
  $(document).ready(function () {
    $('#recipient-password-ok').on('input propertychange', function () {
      stupassword = $.trim($('#recipient-password').val());
      stupassword_ok = $.trim($('#recipient-password-ok').val());
      if (stupassword == stupassword_ok) {
        $("#msg_pwd").html("<font color='green'>两次密码匹配通过 √</font>");
        $("#model_button_ok").attr("disabled", false);
      } else {
        $("#msg_pwd").html("<font color='red'>两次密码不匹配 X</font>");
        $("#model_button_ok").attr("disabled", true);
      }
    });
  });
  /* OK按钮 */
  $('#model_button_ok').click(function () {
    stunm = $.trim($('#recipient-id').val());
    stuname = $.trim($('#recipient-name').val());
    stupassword = $.trim($('#recipient-password').val());
    stupassword_ok = $.trim($('#recipient-password-ok').val());
    if (stunm == '' || stuname == '' || stupassword == '' || stupassword_ok == '') {
      $(function () {
        $('[data-toggle="popover"]').popover()
      })
    } else {
      // 添加数据口
      addDataToteacherDb('studentinfo', stunm, stuname, stupassword);
      console.log(stunm, stuname, stupassword);
      $('#model_button_ok').popover('destroy')
      $("#msg_pwd").html("");
      closemodel('#myresidentstudent');
    }
  });
}

// 查找课程
function QueryTable(stunm, stuname, stupassword, teacherclassname) {
  var openDB = indexedDB.open('studentSystemDB', 2);
  var db;
  openDB.onsuccess = function (e) {
      // 获取数据库实例
      db = openDB.result;
      var transaction = db.transaction(['teachertable'], 'readonly');
      var store = transaction.objectStore('teachertable');
      var index = store.index('teachclass');
      var request = index.get(teacherclassname);
      request.onsuccess = function (e) {
          var result = e.target.result;
          if (result) {
              console.log(result.teachclass);
              alert('该课程已存在');
          } else {
              console.log('查找失败');
              addDataToteacherDb('teachertable', stunm, stuname, stupassword, teacherclassname);
              console.log(stunm, stuname, stupassword, teacherclassname);
              $('#teacher_model_button_ok').popover('destroy')
              $("#teacher-msg_pwd").html("");
              closemodel('#myresidentteacher');
          }
      }

  }
}
/* 老师注册 */
function teacher_residentbutton() {
  var stunm = '';
  var stuname = '';
  var stupassword = '';
  // 确认密码文本
  $(document).ready(function () {
    $('#recipient-teacher-passwordok').on('input propertychange', function () {
      stupassword = $.trim($('#recipient-teacher-password').val());
      stupassword_ok = $.trim($('#recipient-teacher-passwordok').val());
      if (stupassword == stupassword_ok) {
        $("#teacher-msg_pwd").html("<font color='green'>两次密码匹配通过 √</font>");
        $("#teacher_model_button_ok").attr("disabled", false);
      } else {
        $("#teacher-msg_pwd").html("<font color='red'>两次密码不匹配 X</font>");
        $("#teacher_model_button_ok").attr("disabled", true);
      }
    });
  });
  /* OK按钮 */
  $('#teacher_model_button_ok').click(function () {
    stunm = $.trim($('#recipient-teacher-num').val());
    stuname = $.trim($('#recipient-teacher-name').val());
    stupassword = $.trim($('#recipient-teacher-password').val());
    stupassword_ok = $.trim($('#recipient-teacher-passwordok').val());
    teacherclassname = $("#recipient-teacher-classname option:selected").text();
    if (stunm == '' || stuname == '' || stupassword == '' || stupassword_ok == '') {
      $(function () {
        $('[data-toggle="popover"]').popover()
      })
    } else {
      // 添加数据口
      // addDataToDb(stunm, stuname, stupassword,teacherclassname);
      // 查找该课程是否已存在
      QueryTable(stunm, stuname, stupassword, teacherclassname);
     
    }
  });
}

/* 关闭模态框（并且清理input内容） */
function closemodel(modelid) {
  $(modelid).modal('hide');
  $(modelid + ' input').val('');
}
/* 添加学生老师方法 */
function addDataToteacherDb(tablename, stunm, stuname, stupassword, teacherclassname) {
  var openDB = indexedDB.open(DBname, version);
  var db;
  var value;
  if (tablename == 'studentinfo') {
    value = {
      stunum: stunm,
      stuname: stuname,
      stupassword: stupassword
    };
  } else if (tablename == 'teachertable') {
    value = {
      teachnum: stunm,
      teachname: stuname,
      teachpassword: stupassword,
      teachclass: teacherclassname
    };
  }
  openDB.onsuccess = function (e) {
    db = openDB.result;
    var request = db.transaction([tablename], 'readwrite')
      .objectStore(tablename)
      .add(value);
    request.onsuccess = function (e) {
      alert('注册成功');
    }
    request.onerror = function (e) {
      alert('注册失败（此用户已存在）');
    }
  }
}

