
var CLIENT_TOKEN = "REPLACE_ME"; //replace it with the correct auth token value of the store item

/**
* Bind functions to various events when the app is loaded
*/
$fh.ready(function() {
  $('#login_btn').live('click', function(){
    doFeedhenryLogin();
  });
  $('#login_page').live('pagebeforeshow', function(event, ui){
    $('#login_name').val("");
    $('#login_password').val("");
    $('#login_explain').text("");
  })
  $('#data_page').live('pageshow', function(event, ui){
    $('#data_info').text("");
    $('#data_key').val("");
    $('#data_value').val("");
    update_data_info();
  })
  $('#save_data_btn').bind('click', function(){
    var key = $('#data_key').val();
    var value = $('#data_value').val();
    if(key.length > 0 && value.length > 0){
      save_data(key, value, function(){
        update_data_info();
      })
    }
  })
  $('#clear_data_btn').bind('click', function(){
    clear_all_data(function(){
      update_data_info();
    })
  });
  $('#logout_btn').bind('click', function(){
    $.mobile.changePage($('#login_choose'), {"transition":"slide", "changeHash":true});
  })
});

/**
* get all the stored data and display it
**/
var update_data_info = function(){
  read_all_data(function(data){
   var data_str = "";
   if(typeof data != "object"){
     data_str = data;
   } else{
     for(var key in data){
       data_str += key + ":" + data[key] + '\n';
     } 
   }
   $('#data_info').text(data_str);
  }) 
}

/**
* Authenticate the user using Google account
**/
var doGoogleLogin = function(){
  var policyId = "MyGooglePolicy";
  $fh.auth({"policyId":policyId, "clientToken": CLIENT_TOKEN, params: {}}, function(res){
    handleLoginSuccess(res);
  }, function(err){
    handleLoginFailure(err);
  })
}

/**
* Authenticate the user using FeedHenry account
**/
var doFeedhenryLogin = function(){
  var user_name = $('#login_name').val();
  var password = $('#login_password').val();
  var policyId = "MyFeedHenryPolicy";
  $fh.auth({"policyId": policyId, "clientToken": CLIENT_TOKEN, params: {"userId": user_name, "password": password}}, function(res){
    handleLoginSuccess(res);
  }, function(err){
    handleLoginFailure(err);
  })
}

/**
* Successfully logged in, show the response details and "Edit data" button
**/
var handleLoginSuccess = function(res){
  $.mobile.changePage($('#result_page'),  {"transition":"slide", "changeHash":true});
  $("#result_status").val("Sucess");
  $('#session_token').val(res.sessionToken);
  $('#session_token_field').show();
  $("#login_explain").text(JSON.stringify(res));
  $("#show_edit_data").show();
}

/**
* Login failed, show the response details. Check the response message and see what errors they are.
* If the message indicating purging data, remove stored data
**/
var handleLoginFailure = function(res){
  $.mobile.changePage($('#result_page'),  {"transition":"slide", "changeHash":true});
  $("#result_status").val("Failure");
  $('#session_token').val("N/A");
  $('#session_token_field').hide();
  $("#show_edit_data").hide();
  var text = "Login Failed. Error Message is : \n";
  text += res.message;
  switch(res.message) {
    case "user_purge_data":
    case "device_purge_data":
      clear_all_data(function(){
        text += "\n All data removed";
        $("#login_explain").text(text);
      })
    default:
      $("#login_explain").text(text);
  }
}

/**
* save the data using $fh.data, save the key to an data index storage
**/
var save_data = function(key, value, callback){
  $fh.data({act:'load', key: 'data_keys'}, function(res){
    var data_keys = res.val;
    if(data_keys == null || data_keys === ""){
      data_keys = [];
    } else {
      data_keys = JSON.parse(data_keys);
    }
    $fh.data({act:'save', key: key, val: value}, function(save_res){
      if($.inArray(key, data_keys) == -1){
        data_keys.push(key);
      }
      var keys_value = JSON.stringify(data_keys);
      $fh.data({act:'save', key: 'data_keys', val: keys_value}, function(keys_res){
        callback();
      }, function(){
        alert("Failed to save data for keys");
      })
    }, function(){
      alert("Failed to save data");
    })
  }, function(){
    alert("Fail to load data");
  })
}

/**
* Read or delete all the data
**/
var all_data = function(action, callback){
  $fh.data({act:'load', key:'data_keys'}, function(res){
    var data_keys = res.val;
    if(data_keys == null || data_keys === ""){
      callback("No data.");
    } else {
      data_keys = JSON.parse(data_keys);
      console.log(data_keys);
      if(data_keys.length == 0){
        callback("No data.");
      } else {
        var all_data = {};
        for(var i=0;i<data_keys.length;i++){
          var key = data_keys[i];
          console.log(key);
          $fh.data({act:action, key: key}, function(load_res){
            console.log(load_res);
            all_data[key] = load_res.val;
            if(i == data_keys.length-1){
              console.log("last data");
              if(action === "remove"){
                $fh.data({act:'remove', key: 'data_keys'}, function(){
                 callback(); 
                })
              } else {
                callback(all_data);
              }
            }
          })
        }
      }
    }
  })
}

var read_all_data = function(callback){
  all_data("load", callback);
}

var clear_all_data = function(callback){
  all_data("remove", callback);
}

