/****验证邮箱格式、手机号码、密码长度、密码的组合***********/
var Validator = {
    checkEmail: function(name) {
      if (/^\w+@\w+(\.\w+)?$/.test(name)) {
        return true;
      }
      return false;
    },
    checkMobile: function(name) {
      if (/^1[34578]\d{9}$/.test(name)) {
        return true;
      }
      return false;
    },

    checkMinLength: function(pwd) {
      if (pwd.length >= 6 && pwd.length <= 12) {
        return true;
      }
      return false;
    },

    checkCombination: function(pwd) {
      if (/(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,12}/.test(pwd)) {
        return true;
      }
      return false;
    }
 }
   export default Validator;