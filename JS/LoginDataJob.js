var version = 2, DBname = 'studentSystemDB';
  logininbutton();
  residentbutton();
  forgetpasswordbutton();
  /* 登录按钮逻辑 */
  function logininbutton() {
    var stunum = '';
    var stupassword = '';
    $('#login-button-go').click(function (params) {
      // console.log($('.student_way').is(':checked'));
      stunum = $.trim($('#exampleInputEmail1').val());
      stupassword = $.trim($('#exampleInputPassword1').val());
      if (stunum == '' || stupassword == '') {
        alert('请输入账号/密码');
      } else {
        // 添加数据口
        // console.log(stunum, stupassword);
        if ($('.student_way').is(':checked')) {
          logininbutton_stuent(stunum, stupassword);
        } else if($('.teacher_way').is(':checked')){
          logininbutton_teacher(stunum, stupassword);
        }else{
          logininbutton_admin(stunum, stupassword);
        }
      }
    });
  }
  /* 学生登录 */
  function logininbutton_stuent(stunum, stupassword) {
    // 此处搜索数据库通过学号查找密码，找到后返回password与输入的password对比，若正确，将名字传输B页面，若不对，弹出警告框
    var openDB = indexedDB.open(DBname, version);
    var db;
    var t;
    openDB.onsuccess = function (e) {
      // 拿到数据库实例
      db = openDB.result;
      var transaction = db.transaction(['studentinfo']);
      var objectStore = transaction.objectStore('studentinfo');
      var request = objectStore.get(stunum);
      request.onsuccess = function (e) {
        if (request.result) {
          t = request.result.stupassword;
          console.log(t);
          if (stupassword == t) {
            // 传值
            var url = "../Stu_Student/student.html?stunum="+ stunum;
            window.location.href = url;
          } else {
            alert('您的密码或账号输入有误');
            $('#exampleInputPassword1').val('');

          }
        } else {
          alert('您的密码或账号输入有误');
          $('#exampleInputPassword1').val('');
        }
      }
      request.onerror = function (e) {
        console.log('事务失败');
      }
    }
  }
  /* 教师登录 */
  function logininbutton_teacher(teachnum, stupassword) {
    var openDB = indexedDB.open(DBname, version);
    var db;
    var t;
    openDB.onsuccess = function (e) {
      // 拿到数据库实例
      db = openDB.result;
      var transaction = db.transaction(['teachertable']);
      var objectStore = transaction.objectStore('teachertable');
      var request = objectStore.get(teachnum);
      request.onsuccess = function (e) {
        if (request.result) {
          t = request.result.teachpassword;
          console.log(t);
          if (stupassword == t) {
            // 传值
            var url = "../Stu_Teacher/teacher.html?teachnum="+ teachnum;
            window.location.href = url;
          } else {
            alert('您的密码或账号输入有误');
            $('#exampleInputPassword1').val('');

          }
        } else {
          alert('您的密码或账号输入有误');
          $('#exampleInputPassword1').val('');
        }
      }
      request.onerror = function (e) {
        console.log('事务失败');
      }
    }
  }

  /*管理员登录 */
  function logininbutton_admin(stunum, stupassword) {
    if (stunum == 'admin' && stupassword == 'admin') {
      window.location.href = '../Stu_Admin/admin.html';
    } else {
      $('#exampleInputPassword1').val('');
      alert('您的密码或账号输入有误');
    }
  }

  /* 学生注册逻辑 */
  function residentbutton() {
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
        addDataToDb(stunm, stuname, stupassword);
        console.log(stunm, stuname, stupassword);
        $('#model_button_ok').popover('destroy')
        $("#msg_pwd").html("");
        closemodel('#register');
      }
    });
  }
  /* 忘记密码逻辑 */
  function forgetpasswordbutton() {
    var stunm = '';
    var stuname = '';
    var stupassword = '';
    $('#model_find_button_ok').click(function () {
      stunm = $.trim($('#recipient-findpasswordbynum').val());
      stuname = $.trim($('#recipient-findpasswordbyname').val());
      if (stunm == '' || stuname == '') {
        $(function () {
          $('[data-toggle="popover"]').popover()
        })
      } else {
        // /*寻找数据*/
        searchDataToDb('stunum', stuname);
        $('#model_find_button_ok').popover('destroy')
        closemodel('#forgetPassword');
      }
    });
  }

  /* 关闭模态框（并且清理input内容） */
  function closemodel(modelid) {
    $(modelid).modal('hide');
    $(modelid + ' input').val('');
  }

  /* studentinfo表添加数据方法 */
  function addDataToDb(stunm, stuname, stupassword) {
    var openDB = indexedDB.open(DBname, version);
    var db;
    openDB.onsuccess = function (e) {
      db = openDB.result;
      var request = db.transaction(['studentinfo'], 'readwrite')
        .objectStore('studentinfo')
        .add({
          stunum: stunm,
          stuname: stuname,
          stupassword: stupassword
        });
      request.onsuccess = function (e) {
        alert('注册成功');
      }
      request.onerror = function (e) {
        alert('注册失败（此用户已存在）');
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

  /* 登录操作数据库逻辑 */
  function loginDatatoDb(stunum, stupassword) {
    var openDB = indexedDB.open(DBname, version);
    var db;
    var t = 1;
    openDB.onsuccess = function (e) {
      // 拿到数据库实例
      db = openDB.result;
      var transaction = db.transaction(['studentinfo']);
      var objectStore = transaction.objectStore('studentinfo');
      var request = objectStore.get(stunum);
      request.onsuccess = function (e) {
        if (request.result) {
          t = request.result.stupassword;
        } else {
          console.log('未获得数据记录');
        }
      }
      request.onerror = function (e) {
        console.log('事务失败');
      }
    }
  }