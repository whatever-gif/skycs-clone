var commonUtils = new function () {
  this.isNullOrEmpty = function (value) {
      if (value !== undefined && value !== null && value.toString().trim().length > 0) {
          return false;
      }
      return true;
  };
  this.isNumber = function (number) {
      // commonUtils.isNumber('a') => true; (không là số)
      // commonUtils.isNumber(1.5.5) => true; (không là số)
      // commonUtils.isNumber(1,5) => true; (không là số) (dấu '.' mới hợp lệ (là phần phân cách thập phân))
      // commonUtils.isNumber(1111.555) => false; (là số)
      var check = false;
      if (!this.isNullOrEmpty(number)) {
          if (!isNaN(number)) {
              check = true; // là số
          }
      }
      return check;
      //return /^-?[\d.]+(?:e-?\d+)?$/.test(number);
  };
  this.addClassCss = function (idorclass, classcss) {
      if (!this.isNullOrEmpty(classcss)) {
          if (!$(idorclass).hasClass(classcss)) {
              $(idorclass).addClass(classcss);
          }
      }
  };
  this.addClass_ElementCss = function ($element, classcss) {
      if (!this.isNullOrEmpty(classcss)) {
          if (!$element.hasClass(classcss)) {
              $element.addClass(classcss);
          }
      }
  };
  this.removeClassCss = function (idorclass, classcss) {
      if (!this.isNullOrEmpty(classcss)) {
          if ($(idorclass).hasClass(classcss)) {
              $(idorclass).removeClass(classcss);
          }
      }
  };
  this.removeClass_ElementCss = function ($element, classcss) {
      if (!this.isNullOrEmpty(classcss)) {
          if ($element.hasClass(classcss)) {
              $element.removeClass(classcss);
          }
      }
  };
  this.checkElementUndefinedOrNull = function (element) {
      if (element !== undefined && element !== null) {
          return false;
      }
      return true;
  };
  this.checkDate = function (date) {
      if (this.isNullOrEmpty(date)) {
          return false;
      }
      var _date = new Date(date);
      var check = (_date instanceof Date);
      return check;
  };
  this.checkElementExists = function (element) {
      //Đoạn xuất excel template gặp lỗi Failed to execute 'querySelector' on 'Document': 'javascript:;' is not a valid selector."
      //element = "#" sẽ xuất hiện lỗi và không chạy tiếp được.
      if (element === "#") {
          return false;
      }
      if (!this.isNullOrEmpty(element)) {
          if ($(element).length > 0) {
              return true;
          }
      }
      return false;
  };
  this.showToastr = function (listToastr) {
      // objToastr = {ToastrType : 'success', ToastrMessage: message};
      // ToastrType: 'success', 'info', 'warning', 'error'
      // ToastrMessage: "<div><input class="input-small" value="textbox"/>&nbsp;<a href="http://johnpapa.net" target="_blank">This is a hyperlink</a></div><div><button type="button" id="okBtn" class="btn btn-primary">Close me</button><button type="button" id="surpriseBtn" class="btn" style="margin: 0 8px 0 8px">Surprise me</button></div>"
      toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "500",
          "hideDuration": "1000",
          "timeOut": "3000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
      }
      if (listToastr !== undefined && listToastr !== null && listToastr.length > 0) {
          for (var i = 0; i < listToastr.length; i++) {
              var objToastr = listToastr[i];
              var toastrType = objToastr.ToastrType;
              var toastrMessage = objToastr.ToastrMessage;
              if (!this.isNullOrEmpty(toastrType) && !this.isNullOrEmpty(toastrMessage)) {
                  toastr[toastrType](toastrMessage);
              }
          }
      }

  };
  this.checkElementIsNullOrEmpty = function (idorclass, classcss, message) {
      var check = true;
      var _value = '';
      if ($(idorclass).length > 0) {
          _value = $(idorclass).val();
          if (this.isNullOrEmpty(_value)) {
              check = false;
              this.addClassCss(idorclass, classcss);
              $(idorclass).focus();
              if (!this.isNullOrEmpty(message)) {
                  alert(message);
              }
              return false;
          }
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      }
      return check;
  };
  this.checkElementIsNullOrEmpty_AddListError = function (listerror, idorclass, classcss, message) {
      //debugger;
      if (listerror === undefined || listerror === null || listerror.length === 0) {
          listerror = [];
      }
      var check = true;
      var _value = '';
      if ($(idorclass).length > 0) {
          _value = $(idorclass).val();
          if (this.isNullOrEmpty(_value)) {
              check = false;
              this.addClassCss(idorclass, classcss);
              if (!this.isNullOrEmpty(message)) {
                  var objToastr = {
                      ToastrType: 'error',
                      ToastrMessage: message
                  };
                  listerror.push(objToastr);
              }
              if (listerror.length === 1) {
                  $(idorclass).focus();
              }
          }
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      }
      return listerror;
  };
  this.checkElementIsSame_AddListError = function (listerror, idorclass, classcss, message) {
      //debugger;
      if (listerror === undefined || listerror === null || listerror.length === 0) {
          listerror = [];
      }
      var check = true;
      var _value = '';
      if ($(idorclass).length > 0) {
          _value = $(idorclass).val();
          check = false;
          this.addClassCss(idorclass, classcss);
          if (!this.isNullOrEmpty(message)) {
              var objToastr = {
                  ToastrType: 'error',
                  ToastrMessage: message
              };
              listerror.push(objToastr);
          }
          if (listerror.length === 1) {
              $(idorclass).focus();
          }
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      }
      return listerror;
  };
  this.checkElementAddListError = function (listerror, idorclass, classcss, message, value) {
      //debugger;
      if (listerror === undefined || listerror === null || listerror.length === 0) {
          listerror = [];
      }
      var check = true;
      var pattern = new RegExp('^[a-zA-Z0-9-_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$');
      var _value = '';
      if ($(idorclass).length > 0) {
          _value = $(idorclass).val();
          if (!pattern.test(value)) {
              check = false;
              this.addClassCss(idorclass, classcss);
              if (!this.isNullOrEmpty(message)) {
                  var objToastr = {
                      ToastrType: 'error',
                      ToastrMessage: message
                  };
                  listerror.push(objToastr);
              }
              if (listerror.length === 1) {
                  $(idorclass).focus();
              }
          }
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      }
      return listerror;
  };
  this.checkCharSpecial = function (value) {
      //debugger;
      var pattern = new RegExp('^[a-zA-Z0-9-_.]+$');
      var check = pattern.test(value);
      return check;
  };
  this.checkElementAddListErrorCode = function (listerror, idorclass, classcss, message, value) {
      //debugger;
      if (listerror === undefined || listerror === null || listerror.length === 0) {
          listerror = [];
      }
      var check = true;
      var pattern = new RegExp('^[a-zA-Z0-9-_]+$');
      var _value = '';
      if ($(idorclass).length > 0) {
          _value = $(idorclass).val();
          if (!pattern.test(value)) {
              check = false;
              this.addClassCss(idorclass, classcss);
              if (!this.isNullOrEmpty(message)) {
                  var objToastr = {
                      ToastrType: 'error',
                      ToastrMessage: message
                  };
                  listerror.push(objToastr);
              }
              if (listerror.length === 1) {
                  $(idorclass).focus();
              }
          }
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      }
      return listerror;
  };
  this.checkElementIsDate = function (idorclass, classcss, message) {
      var check = true;
      _value = $(idorclass).val();
      check = this.checkDate(_value);
      if (!check) {
          AddClassCss(idorclass, classcss);
          $(idorclass).focus();
          if (!this.isNullOrEmpty(message)) {
              alert(message);
          }
          return false;
      }
      else {
          RemoveClassCss(idorclass, classcss);
      }
      return check;
  };
  this.checkElementIsNumber = function (idorclass, classcss, message) {
      var check = true;
      _value = $(idorclass).val();
      if (!this.isNumber(_value)) {
          check = false;
          this.addClassCss(idorclass, classcss);
          $(idorclass).focus();
          if (!this.isNullOrEmpty(message)) {
              alert(message);
          }
          return false;
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      }
      return check;
  };
  this.checkElementIsNumber_GE_Zero = function (idorclass, classcss, message) {
      // Is greater than or equal to
      var check = true;
      _value = $(idorclass).val();
      if (this.isNumber(_value)) {
          if (parseFloat(_value.toString().trim()) < 0) {
              check = false;
          }
      } else {
          check = false;
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      } else {
          this.addClassCss(idorclass, classcss);
          $(idorclass).focus();
          if (!this.isNullOrEmpty(message)) {
              alert(message);
          }
      }
      return check;
  };
  this.checkIsNumber_IsGreater_Zero = function (idorclass, classcss, message) {
      var check = true;
      _value = $(idorclass).val();
      if (this.isNumber(_value)) {
          if (parseFloat(_value.toString().trim()) <= 0) {
              check = false;
          }
      } else {
          check = false;
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      } else {
          this.addClassCss(idorclass, classcss);
          $(idorclass).focus();
          if (!this.isNullOrEmpty(message)) {
              alert(message);
          }
      }
      return check;
  };
  this.checkIsNumber_IsGreaterOrSame_Zero = function (idorclass, classcss, message) {
      var check = true;
      _value = $(idorclass).val();
      if (this.isNumber(_value)) {
          if (parseFloat(_value.toString().trim()) < 0) {
              check = false;
          }
      } else {
          check = false;
      }
      if (check) {
          this.removeClassCss(idorclass, classcss);
      } else {
          this.addClassCss(idorclass, classcss);
          $(idorclass).focus();
          if (!this.isNullOrEmpty(message)) {
              alert(message);
          }
      }
      return check;
  };
  this.returnJSONValue = function (data) {
      var value = null;
      if (!this.isNullOrEmpty(data)) {
          value = JSON.stringify(data);
      }
      return value;
  };
  this.returnValueOrNull = function (data) {
      var value = null;
      if (!this.isNullOrEmpty(data)) {
          value = data.toString().trim();
      }
      return value;
  };
  this.returnValue = function (data) {
      var value = '';
      if (!this.isNullOrEmpty(data)) {
          value = data.toString().trim();
      }
      return value;
  };
  this.returnValueTextOrNull = function (element) {
      var value = null;
      if (this.checkElementExists(element)) {
          var _value = $(element).val();
          if (!this.isNullOrEmpty(_value)) {
              value = _value.toString().trim();
          }
      }
      return value;
  };
  this.returnValueText = function (element) {
      var value = '';
      if (this.checkElementExists(element)) {
          var _value = $(element).val();
          if (!this.isNullOrEmpty(_value)) {
              value = _value.toString().trim();
          }
      }
      return value;
  };
  this.returnValueInt = function (element) {
      var value = 0;
      if (this.checkElementExists(element)) {
          var _value = $(element).val();
          if (!this.isNullOrEmpty(_value) && this.isNumber(_value)) {
              value = parseInt(_value);
          }
      }
      return value;
  };
  this.returnValueFloat = function (element) {
      var value = 0.0;
      if (this.checkElementExists(element)) {
          var _value = $(element).val();
          if (!this.isNullOrEmpty(_value) && this.isNumber(_value)) {
              value = parseFloat(_value);
          }
      }
      return value;
  };
  this.returnValueMinOrMax = function (value, min, max) {
      //<input type="text" name="textWeight" id="txtWeight" maxlength="5" onkeyup="this.value = minmax(this.value, 0, 100)"/>
      if (parseInt(value) < min || isNaN(parseInt(value)))
          return min;
      else if (parseInt(value) > max)
          return max;
      else return value;
  };
  this.returnValuePositiveRealNumber = function (value) {
      //<input type="text" name="textWeight" id="txtWeight" maxlength="5" onkeyup="this.value = minmax(this.value)"/>
      var _value = 0.0;
      if (isNaN(parseFloat(value))) {
          _value = 0.0;
      } else if (parseFloat(value) < 0) {
          var _val = parseFloat(value.replace(/,/g, ""));
          _value = value.substr(1);
          //_value = value * (-1);
      } else {
          _value = value;
      }
      return _value;
  };

  this.returnValuePositiveRealNumber_Element = function (value, element) {
      var _value = 0.0;
      if (isNaN(parseFloat(value))) {
          _value = 0.0;
      } else if (parseFloat(value) < 0) {
          var _val = parseFloat(value.replace(/,/g, ""));
          _value = value.substr(1);
      } else {
          _value = value;
      }
      $(element).val(_value);
  };

  this.returnValueCheckBox = function (element) {
      var value = null;
      if (this.checkElementExists(element)) {
          var inputCheckBox = $(element);
          if (inputCheckBox !== undefined && inputCheckBox !== null) {
              if (inputCheckBox.prop('checked')) {
                  value = '1';
              }
          }
      }
      return value;
  };
  this.parseInt = function (number) {
      var value = 0;
      if (!this.isNullOrEmpty(number) && this.isNumber(number)) {
          value = parseInt(number);
      }
      return value;
  };
  this.parseFloat = function (number) {
      var value = 0.0;
      if (!this.isNullOrEmpty(number) && this.isNumber(number)) {
          value = parseFloat(number);
      }
      return value;
  };
  this.totalParseInt = function (element1, element2) {
      var total = 0;
      var value1 = 0;
      var value2 = 0;
      value1 = this.returnValueInt(element1);
      value2 = this.returnValueInt(element2);
      total = value1 + value2;
      return total;
  };
  this.totalParseFloat = function (element1, element2) {
      var total = 0.0;
      var value1 = 0.0;
      var value2 = 0.0;
      value1 = this.returnValueFloat(element1);
      value2 = this.returnValueFloat(element2);
      total = value1 + value2;
      return total;
  };
  this.lamTronSo = function (number, scale) {
      //number: số
      //scale: làm tròn bao nhiêu số sau dấu thập phân
      var _number = this.parseFloat(number.toString());
      var _scale = this.parseFloat(scale.toString());

      if (!("" + _number).includes("e")) {
          return +(Math.round(_number + "e+" + _scale) + "e-" + _scale);
      } else {
          var arr = ("" + _number).split("e");
          var sig = "";
          if (+arr[1] + _scale > 0) {
              sig = "+";
          }
          var i = +arr[0] + "e" + sig + (+arr[1] + _scale);
          var j = Math.round(i);
          var k = +(j + "e-" + _scale);
          return k;
      }
  };
  this.genParamContractCode = function () {
      var dDate = new Date();
      var year = dDate.getFullYear().toString();
      var month = ((dDate.getMonth() + 1) < 10) ? '0' + (dDate.getMonth() + 1).toString() : (dDate.getMonth() + 1).toString();
      var date = (dDate.getDate() < 10) ? '0' + dDate.getDate().toString() : dDate.getDate().toString();
      var hours = (dDate.getHours() < 10) ? '0' + dDate.getHours().toString() : dDate.getHours().toString();
      var minutes = (dDate.getMinutes() < 10) ? '0' + dDate.getMinutes().toString() : dDate.getMinutes().toString();
      var seconds = (dDate.getSeconds() < 10) ? '0' + dDate.getSeconds().toString() : dDate.getSeconds().toString();

      return `${year}${month}${date}.${hours}${minutes}${seconds}`;
  };
  //tao unique id
  this.uuidv4 = function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
  };
  this.toLowerCase = function (data) {
      var value = '';
      if (!this.isNullOrEmpty(data)) {
          value = data.toString().trim().toLowerCase();
      }
      return value;
  };
  this.toUpperCase = function (data) {
      var value = '';
      if (!this.isNullOrEmpty(data)) {
          value = data.toString().trim().toUpperCase();
      }
      return value;
  };
  this.locDau = function (thiz) {
      // using : onkeyup="commonUtils.locDau(this);"
      var str;
      if (eval(thiz)) {
          str = eval(thiz).value;
      } else {
          str = thiz;
      }

      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ |ặ|ẳ|ẵ/g, "a");

      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ |Ặ|Ẳ|Ẵ/g, "A");

      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");

      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");

      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");

      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");

      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ |ợ|ở|ỡ/g, "o");

      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ |Ợ|Ở|Ỡ/g, "O");

      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");

      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");

      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");

      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");

      str = str.replace(/đ/g, "d");

      str = str.replace(/Đ/g, "D");

      //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
      //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|\/|,|\:|\;|\'| |\"|\&|\#|\$|\`|\[|\]|~|$|_/g, "-"); // cho phép nhập dấu ., các ký tự ko cho phép -> -
      //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|\/|,|\:|\;|\'| |\"|\&|\#|\$|\`|\[|\]|~|$|/g, ""); // cho phép nhập dấu ., các ký tự ko cho phép -> -
      str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|,|\:|\;|\'| |\"|\&|\#|\$|\`|\[|\]|~|$|/g, ""); // cho phép nhập dấu ., các ký tự ko cho phép -> -
      /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */

      str = str.replace(/-+-/g, "-");//thay thế 2- thành 1- 
      str = str.replace(/_+_/g, "_");//thay thế 2 _ thành 1 _
      str = str.replace(/\.+\./g, ".");//thay thế 2 . thành 1 .

      str = str.replace(/^\-+/g, ""); //cắt bỏ ký tự - ở đầu
      str = str.replace(/^\_+/g, ""); //cắt bỏ ký tự _ ở đầu
      str = str.replace(/^\.+/g, ""); //cắt bỏ ký tự . ở đầu

      //str = str.replace(/^\-+|\-+$/g, ""); //
      //str = str.replace(/\-/g, "");
      //cắt bỏ ký tự - ở đầu và cuối chuỗi 

      eval(thiz).value = str.trim();

  };

  this.vnconvert = function (str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");

      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/đ/g, "d");


      return str;
  }
  this.reverse = function (chuoi) {
      // Đảo ngược chuỗi
      var _chuoi = '';
      for (var i = chuoi.length - 1; i >= 0; i--)
          _chuoi += chuoi[i];
      return _chuoi;
  };
  this.catChuoi = function (chuoi, soluongkytu) {
      var subchuoi = '';
      if (!IsNullOrEmpty(chuoi)) {
          chuoi = chuoi.toString().trim();
          if (chuoi.length <= soluongkytu) {
              subchuoi = chuoi;
          } else {
              var indexOf = chuoi.lastIndexOf(" ", soluongkytu);
              if (indexOf > 0) {
                  subchuoi = chuoi.substring(0, indexOf).trim() + '...';
              } else {
                  subchuoi = chuoi.substring(0, soluongkytu).trim() + '...';
              }
          }
      }
      return subchuoi;
  };
  this.blockSpecialChar = function (e) {
      // không cho nhập ký tự đặc biệt
      // <input type="text" name="txtName"  onkeypress="return commonUtils.blockSpecialChar(event)"/>
      var k;
      document.all ? k = e.keyCode : k = e.which;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
  };
  this.allLetter = function (inputtxt) {
      // Chỉ cho nhập ký tự
      // <input type="text" id="inputText" name="inputText"/>
      // allLetter('#inputText');
      var letters = /^[A-Za-z]+$/;
      if ($(inputtxt).val().match(letters)) {
          return true;
      }
      else {
          return false;
      }
  };
  this.replaceAll = function (chuoi, chuoicanthaythe, chuoithaythe) {
      //var chuoi = 'Báo điện -tử-dân trí baodientudantri-https://dantri.com.vn';
      //var chuoicanthaythe = "/";
      //var chuoithaythe = " // ";
      var patt = new RegExp(chuoicanthaythe, "g");
      return chuoi.replace(patt, chuoithaythe);
  };
  this.replaceAll_Arrays_ChuoiCanThayThe = function (chuoi, chuoicanthaythe, chuoithaythe) {
      //var chuoi = 'Báo điện -tử-dân trí baodientudantri-https://dantri.com.vn';
      //var chuoicanthaythe = ["/", "-"];
      //var chuoithaythe = ["//", " – "];
      if (chuoicanthaythe !== null && chuoicanthaythe.length > 0) {
          for (var i = 0; i < chuoicanthaythe.length; i++) {
              var _chuoicanthaythe = chuoicanthaythe[i];
              var _chuoithaythe = chuoithaythe[i];
              var patt = new RegExp(_chuoicanthaythe, "g");
              chuoi = chuoi.replace(patt, _chuoithaythe);
          }
      }
      return chuoi;
  };
  this.formatNumber = function (number, scale) {
      //number: số
      //scale: lấy bao số phần thập phân
      // using fnumber = formatNumber(parseFloat(number), parseInt(scale));

      var _number = number.toFixed(scale) + '';
      var x = _number.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      if (scale === 0) {
          return x1; //10,000
      } else {
          return x1 + x2; //10,000.05
      }
  };
  this.formatNumberByJqueryNumber = function (element, scale) {
      // element = '.qty' or '#qty'
      if ($(element).length > 0) {
          $(element).number(true, scale);
      }
  };
  this.isNumberKey = function (evt) {
      //<input id="txtChar" onKeyPress="return isNumberKey(event)" type="text" name="txtChar">
      var charCode = (evt.which) ? evt.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
  };
  this.validateMobile = function (phoneno) {
      // Số di động
      // true: hợp lệ
      var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      if (!IsNullOrEmpty(phoneno)) {
          phoneno = phoneno.toString().trim();
          var phone = phoneno.replace('(84)', '0');
          phone = phoneno.replace('+84', '0');
          phone = phoneno.replace('0084', '0');
          phone = phoneno.replace(/ /g, '');
          var validateMobile = vnf_regex.test(phone);
          return validateMobile;
          //return vnf_regex.test(phoneno);
      } else {
          return false;
      }
  };
  this.validatePhone = function (phoneno) {
      var vnf_regex = /^\+?(?:0|84)(?:\d){9,10}$/;
      var isValid = vnf_regex.test(phoneno);
      if (isValid) {
          return true;
      }
      else {
          return false;
      }
  };
  this.validateEmail = function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };
  this.validateHhMm = function (time) {
      var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
      if (isValid) {
          return true;
      } else {
          return false;
      }
  };
  this.dateTimeSubtractDays = function (first, second) {
      var timeFirst = new Date(first).getTime();
      var timeSecond = new Date(second).getTime();
      var diff = timeFirst - timeSecond;
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return days;
  };
  this.dateTimeAddDays = function (first, second) {
      var date = new Date(first);
      date.setDate(date.getDate() + second);
      return date;
  };
  this.dateTimeAddHours = function (first, second) {
      var date = new Date(first);
      date.setHours(date.getHours() + second);
      return date;
  };
  this.compareTwoDates = function (first, second) {
      // first > second => return true 
      var timeFirst = new Date(first).getTime();
      var timeSecond = new Date(second).getTime();
      if (timeFirst > timeSecond) {
          return true;
      } else {
          return false;
      }
  };
  this.compareTwoDates_GE = function (first, second) {
      // Is greater than or equal to
      // first >= second => return true 
      var timeFirst = new Date(first).getTime();
      var timeSecond = new Date(second).getTime();
      if (timeFirst >= timeSecond) {
          return true;
      } else {
          return false;
      }
  };
  this.compareTwoDates_GE_1 = function (first, second) {
      // Is greater than or equal to
      // first >= second => return true 
      var timeFirst = new Date(first).getTime();
      var timeSecond = new Date(second).getTime();
      if (timeFirst <= timeSecond) {
          return true;
      } else {
          return false;
      }
  };
  this.totalMonths = function (enddate, startdate) {
      var totalMonths;
      var startdateCur = new Date(startdate);
      var enddateCur = new Date(enddate);
      var startMonthCur = startdateCur.getMonth();
      var startYearCur = startdateCur.getFullYear();
      var endMonthCur = enddateCur.getMonth();
      var endYearCur = enddateCur.getFullYear();
      totalMonths = (endYearCur - startYearCur) * 12;
      //totalMonths -= startMonthCur + 1;
      totalMonths -= (startMonthCur + 1);
      totalMonths += (endMonthCur + 1);
      return totalMonths <= 0 ? 0 : totalMonths;
      //return totalMonths;
  };
  this.getTimeAgo = function (startdate, enddate) {
      var strTime = "";
      if (this.checkDate(startdate) && this.checkDate(enddate)) {
          var startdateCur = new Date(startdate);
          var enddateCur = new Date(enddate);
          var timeSpan = enddateCur.getTime() - startdateCur.getTime();

          var deltaSeconds = this.parseFloat(timeSpan / 1000); // TotalSeconds
          var deltaMinutes = this.parseFloat(deltaSeconds / 60.0);
          var minutes = this.parseInt(0);

          if (deltaSeconds < 5) {
              strTime = "Vừa mới"; // "Just now"
          }
          else if (deltaSeconds < 60) {
              strTime = Math.floor(deltaSeconds) + " giây trước"; // " seconds ago"
          }
          else if (deltaSeconds < 120) {
              strTime = "1 phút trước"; // "A minute ago"
          }
          else if (deltaMinutes < 60) {
              strTime = Math.floor(deltaMinutes) + " phút trước"; // " minutes ago"
          }
          else if (deltaMinutes < 120) {
              strTime = "1 giờ trước"; // "An hour ago"
          }
          else if (deltaMinutes < (24 * 60)) {
              minutes = this.parseInt(Math.floor(deltaMinutes / 60));
              strTime = minutes + " giờ trước"; //  " hours ago"
          }
          else if (deltaMinutes < (24 * 60 * 2)) {
              strTime = "Hôm qua"; // "Yesterday"
          }
          else if (deltaMinutes < (24 * 60 * 7)) {
              minutes = this.parseInt(Math.floor(deltaMinutes / (60 * 24)));
              strTime = minutes + " ngày trước"; // " days ago"
          }
          else if (deltaMinutes < (24 * 60 * 14)) {
              strTime = "Tuần trước"; // "Last week"
          }
          else if (deltaMinutes < (24 * 60 * 31)) {
              minutes = this.parseInt(Math.floor(deltaMinutes / (60 * 24 * 7)));
              strTime = minutes + " tuần trước"; // " weeks ago"
          }
          else if (deltaMinutes < (24 * 60 * 61)) {
              strTime = "Tháng trước"; // Last month
          }
          else if (deltaMinutes < (24 * 60 * 365.25)) {
              minutes = this.parseInt(Math.floor(deltaMinutes / (60 * 24 * 30)));
              strTime = minutes + " tháng trước"; // " months ago"
          }
          else if (deltaMinutes < (24 * 60 * 731)) {
              strTime = "1 năm trước"; // "Last year"
          }
          else {
              minutes = this.parseInt(Math.floor(deltaMinutes / (60 * 24 * 365)));
              strTime = minutes + " năm trước"; // " years ago"
          }
      }
      return strTime;

  };
  this.setDefaultValueZero = function (thiz) {
      setTimeout(function () {
          var valueCur = $(thiz).val();
          if (IsNullOrEmpty(valueCur)) {
              $(thiz).val('0');
          }
      });
  };
  this.setValueElement = function (thiz, data) {
      if (!this.checkElementUndefinedOrNull(thiz)) {
          //if (!this.isNullOrEmpty(data)) {
          //    var value = this.returnValue(data);
          //    $(thiz).val(value);
          //}

          $(thiz).val(data);
      }
  };
  this.setValueAttributeElement = function (thiz, attribute, data) {
      if (!this.checkElementUndefinedOrNull(thiz)) {
          if (!this.isNullOrEmpty(attribute)) {
              //var value = this.returnValue(data);
              $(thiz).attr(attribute, data);
          }
      }
  };
  this.getValueAttributeElement = function (thiz, attribute) {
      var value = '';
      if (!this.checkElementUndefinedOrNull(thiz)) {
          if (!this.isNullOrEmpty(attribute)) {
              var data = $(thiz).attr(attribute);
              value = this.returnValue(data);
          }
      }
      return value;
  };
  this.checkAll_CheckBox = function (thiz, inputcheckbox) {
      // inputcheckbox: '.table-tbody input.ace'
      // inputcheckbox: '#table-tbodyID input.sl_ace'
      // inputcheckbox: '.table-tbody input.chked'
      var c_all = false;
      if ($(thiz).is(":checked")) {
          c_all = true;
      }
      $(inputcheckbox).prop("checked", c_all);
  };
  this.checkBox_CheckBox = function (thiz, $thead, $tbody) {
      var c_all = false;
      if ($(thiz).is(":checked")) {
          c_all = true;
      }
      if (!c_all) {
          var $inputCheckBox_CheckAll = $thead.find('input.cl-check');
          if ($inputCheckBox_CheckAll !== undefined && $inputCheckBox_CheckAll !== null) {
              $inputCheckBox_CheckAll.prop("checked", c_all);
          }
      }
      else {
          var rows = $tbody.find('tr.trdata').length;
          if (rows > 0) {
              //var trArr = $('.table-tbody tbody tr.trdata').has('input[class="ace"]:checked');
              var trArr = $tbody.find('tr.trdata').has('input[type=checkbox]:checked');
              if (trArr !== null) {
                  var trLength = trArr.length;
                  if (trLength === rows) {
                      $thead.find('input.cl-check').prop("checked", c_all);
                  }
                  else {
                      $thead.find('input.cl-check').prop("checked", !c_all);
                  }
              }
              else {
                  $thead.find('input.cl-check').prop("checked", !c_all);
              }
          }
      }
  };
  this.checkBox = function (thiz) {
      var c_all = false;
      if ($(thiz).is(":checked")) {
          c_all = true;
      }
      if (!c_all) {
          $(".table-thead input.ace").prop("checked", c_all);
      }
      else {
          var rows = $(".table-tbody tbody tr.trdata").length;
          if (rows > 0) {
              //var trArr = $('.table-tbody tbody tr.trdata').has('input[class="ace"]:checked');
              var trArr = $('.table-tbody tbody tr.trdata').has('input[type=checkbox]:checked');
              if (trArr !== null) {
                  var trLength = trArr.length;
                  if (trLength === rows) {
                      $(".table-thead input.ace").prop("checked", c_all);
                  }
                  else {
                      $(".table-thead input.ace").prop("checked", !c_all);
                  }
              }
              else {
                  $(".table-thead input.ace").prop("checked", !c_all);
              }
          }
      }
  };
  this.changeCheckBox = function (thiz) {
      var checkBox = $(thiz);
      if (checkBox !== null && checkBox !== undefined) {
          if (checkBox.is(':checked')) {
              checkBox.prop('checked', true);
              checkBox.val(true);
          } else {
              checkBox.prop('checked', false);
              checkBox.val(false);
          }
      }
  };
  this.checkFileExcelImport = function (thiz, e) {
      var checkFile = false;
      var fileName = e.target.files[0].name;
      if (fileName !== undefined && fileName !== null && fileName.trim().length > 0) {
          var _index = fileName.lastIndexOf('.');
          if (_index !== undefined && _index !== null && _index > 0) {
              var fileType = fileName.substring(_index + 1, fileName.length).toLowerCase();
              if (fileType === 'xls' || fileType.toLowerCase() === 'xlsx') {
                  checkFile = true;
              }
          }
      }
      if (!checkFile) {
          alert("File excel Import không hợp lệ!");
          $(thiz).val('');
          return false;
      }
      return true;
  };
  this.checkFileJsonImport = function (thiz, e) {
      var checkFile = false;
      var fileName = e.target.files[0].name;
      if (fileName !== undefined && fileName !== null && fileName.trim().length > 0) {
          var _index = fileName.lastIndexOf('.');
          if (_index !== undefined && _index !== null && _index > 0) {
              var fileType = fileName.substring(_index + 1, fileName.length).toLowerCase();
              if (fileType === 'json') {
                  checkFile = true;
              }
          }
      }
      if (!checkFile) {
          alert("File Import không hợp lệ!");
          $(thiz).val('');
          return false;
      }
      return true;
  };
  this.readURL = function (input) {
      var thumbimages = "#" + $(input).attr("inputid");
      if (input.files && input.files[0]) {
          var name = input.files[0].name;
          if (!name.match(/(?:gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/)) {
              alert("File upload phải thuộc các định dạng sau: \" gif | jpg | png | bmp \"!");
              return false;
          } else {
              var reader = new window.FileReader();
              reader.onload = function (e) {
                  $(thumbimages).attr('src', e.target.result);
              };
              reader.readAsDataURL(input.files[0]);
              $(thumbimages).show();
          }
      }
      else {
          $(thumbimages).attr('src', input.value);
          $(thumbimages).show();
      }
      $('.filename').text($(".uploadfile").val());
      return false;
  };
  this.readFileURL = function (input) {
      var thumbfile = "#" + $(input).attr("inputid");
      if (input.files && input.files[0]) {
          var name = input.files[0].name;
          if (!name.match(/(?:doc|docx|xls|xlsx|ppt|ppts|pps|ppsx|pptx|mdb|pdf|psd|gif|jpg|jpeg|png|bmp|rar|zip|html|htm|xml)$/)) {
              alert("File upload phải thuộc các định dạng sau: \" doc | docx | xls | xlsx | ppt | ppts | pps | ppsx | pptx | mdb | pdf | psd | gif | jpg | jpeg | png | bmp | rar | zip | html | htm | xml \"!");
              return false;
          } else {
              var reader = new window.FileReader();
              reader.onload = function (e) {
                  if (name.match(/(?:gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/)) {
                      $(thumbfile).attr('src', e.target.result);
                  } else {
                      $(thumbfile).attr('src', '/Content/assets/avatars/profile-pic.jpg');
                  }
              };
              reader.readAsDataURL(input.files[0]);
              $(thumbfile).show();
          }
      }
      else {
          $(thumbfile).attr('src', input.value);
          $(thumbfile).show();
      }
      $('.filename').text($(".uploadfile").val());
      return false;
  };
  this.getUrlParameter = function (strparam) {
      // using: http://dummy.com/?technology=jquery&blog=jquerybyexample
      // var tech = getUrlParameter('technology');
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;
      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] === strparam) {
              return sParameterName[1] === undefined ? true : sParameterName[1];
          }
      }
  };
  this.updateTableTrIdx = function ($selector, displayIdx) {
      var idx = 0;
      $selector.each(function () {
          var tr = $(this);
          var odx = tr.attr('idx');
          if (odx !== undefined) {
              if (displayIdx === true) {
                  var ftd = tr.find('td').eq(0).text(idx + 1);
              }
              odx = odx * 1;
              tr.find('input[name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('textarea[name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
          }
          tr.attr('idx', idx);
          idx++;
      });
  };
  this.updateTableTrIdxbom = function ($selector, displayIdx) {
      //debugger;
      var idx = 1;
      $selector.each(function () {
          var tr = $(this);
          var odx = tr.attr('idx');
          if (odx !== undefined) {
              if (displayIdx === true) {
                  var ftd = tr.find('td').eq(1).text(idx);
              }
              //debugger
              odx = odx * 1;
              odx = 0
              tr.find('input[name*="ListBOM[' + odx + '].ProductCode"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].OrgID"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductCodeParent"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].Qty"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].mp_UPSell"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].mp_UPBuy"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductType"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductName"]').each(function () {
                  debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('tr[class*="xoa_[' + odx + ']"]').each(function () {
                  var name = $(this).attr('class');
                  var nname = name.replace('xoa_[' + odx + ']', 'xoa_[' + idx + ']');
                  $(this).attr('class', nname);
              });
              tr.find('textarea[name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
          }
          tr.attr('idx', idx);
          idx++;
      });
  };
  this.updateTableTrIdxbomdelete = function ($selector, displayIdx) {
      //debugger;
      var idx = 1;
      $selector.each(function () {
          var tr = $(this);
          var odx = tr.attr('idx');
          if (odx !== undefined) {
              if (displayIdx === true) {
                  var ftd = tr.find('td').eq(1).text(idx);
              }
              //debugger
              odx = odx * 1;
              tr.find('input[name*="ListBOM[' + odx + '].ProductCode"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].OrgID"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductCodeParent"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].Qty"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].mp_UPSell"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].mp_UPBuy"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductType"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductName"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('tr[class*="xoa_[' + odx + ']"]').each(function () {
                  var name = $(this).attr('class');
                  var nname = name.replace('xoa_[' + odx + ']', 'xoa_[' + idx + ']');
                  $(this).attr('class', nname);
              });

              tr.find('textarea[name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });

          }
          tr.attr('idx', idx);
          idx++;
      });
  };
  this.updateTableTrIdxProduct = function ($selector, displayIdx) {
      //debugger;
      var idx = 1;
      $selector.each(function () {
          var tr = $(this);
          var odx = tr.attr('idx');
          if (odx !== undefined) {
              if (displayIdx === true) {
                  var ftd = tr.find('td').eq(1).text(idx);
              }
              //debugger
              odx = odx * 1;
              tr.find('input[name*="ListProduct[' + odx + '].ProductCode"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].OrgID"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].ProductCodeRoot"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListBOM[' + odx + '].ProductType"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].ProductName"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].UnitCode"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].UPSell"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].UPBuy"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].ValPrice"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].CurrencyCode"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[name*="ListProduct[' + odx + '].ExchangeRate"]').each(function () {
                  //debugger
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('tr[class*="xoa_[' + odx + ']"]').each(function () {
                  var name = $(this).attr('class');
                  var nname = name.replace('xoa_[' + odx + ']', 'xoa_[' + idx + ']');
                  $(this).attr('class', nname);
              });

              //tr.find('textarea[name*="[' + odx + ']"]').each(function () {
              //    var name = $(this).attr('name');
              //    var nname = name.replace('[' + odx + ']', '[' + idx + ']');
              //    $(this).attr('name', nname);
              //});

          }
          tr.attr('idx', idx);
          idx++;
      });
  };
  this.updateTableTrNotShowIdx = function ($selector, displayIdx) {
      var idx = 0;
      $selector.each(function () {
          var tr = $(this);
          var odx = tr.attr('idx');
          if (odx !== undefined) {
              if (displayIdx === true) {
                  //var ftd = tr.find('td').eq(0).text(idx + 1);
              }
              odx = odx * 1;
              tr.find('input[type="hidden"][name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('input[type="text"][name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
              tr.find('textarea[name*="[' + odx + ']"]').each(function () {
                  var name = $(this).attr('name');
                  var nname = name.replace('[' + odx + ']', '[' + idx + ']');
                  $(this).attr('name', nname);
              });
          }
          tr.attr('idx', idx);
          idx++;
      });
  };
  this.getHtmlFromTemplate = function ($t, data, extData) {
      var html = $t.html();
      for (var key in data) {
          var s = '==' + key + '==';

          var val = data[key];
          if (val == null || val == undefined || val == NaN) val = '';
          html = html.replace(new RegExp(s, 'g'), val);
      }
      if (extData !== undefined) {
          for (var keyext in extData) {
              var sext = '==' + keyext + '==';
              var val = extData[keyext];
              if (val == null || val == undefined || val == NaN) val = '';
              html = html.replace(new RegExp(sext, 'g'), val);
          }
      }
      return html;
  };
  this.setAdminCurrentTag = function (parents, parentText) {
      for (var i = 0; i < parents.length; i++) {
          var childLi = "";
          if (i !== 0) {
              childLi += "<li>";
          } else {
              childLi += "<li class=\"breadcrumb-remove-content\">";
          }
          if (parents[i] !== null && parents[i] !== undefined && parents[i].toString().trim().length > 0 && parents[i].toString().trim() !== '#') {
              childLi += "<a href='" + parents[i] + "'\>" + parentText[i] + "</a>";

          } else {
              childLi += "<span style=\"color: ##3b81ab;\">" + parentText[i] + "</span>";
          }
          childLi += "</li>";
          //alert(parents[i] + "ABC" + parentText[i]);
          $('ul.breadcrumb').append(childLi);
      }
  };
  this.setAdminCurrentUrl = function (url) {
      $('.nav-list a[href="' + url + '"]').each(function () {
          $(this).closest('li').addClass('active');
          $(this).closest('li').closest('ul').show();
          $(this).closest('li').closest('ul').closest('li').addClass('active open');

          $(this).closest('li').closest('ul').closest('li').closest('ul').closest('li').addClass('active open');
      });

      //Thêm mới cập nhật menu ngang 07/06/2019
      $('.nav.navbar-nav a[href="' + url + '"]').each(function () {
          $(this).closest('li').addClass('active');
          $(this).closest('li').closest('ul').show();
          $(this).closest('li').closest('ul').closest('li').addClass('active open');

          $(this).closest('li').closest('ul').closest('li').closest('ul').closest('li').addClass('active open');
      });
  };
  this.closeModalPopup = function (modalPopup) {
      $('#' + modalPopup).modal("hide");
      $('#' + modalPopup).html('');
  };
  this.setFocus = function (element) {
      // setFocus
      // <input type="text" id="inputText" name="inputText"/>
      // setFocus('inputText');
      window.setTimeout(function () {
          document.getElementById(element).focus();
      }, 0);
  };
  this.goBack = function () {
      window.history.back();
  };
  this.window_location_href = function (url) {
      window.location.href = url;
  };
  this.showAlert = function (message) {
      alert(message);
  };
  this.showErrorMessage = function () {

  };
  this.genCode = function (str) {
      //Xóa dấu
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      //Loại bỏ ký tự không phải chữ và số
      str = str.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '');
      //Xóa khoảng trắng
      str = str.replace(/\s+/g, '');
      str.trim();
      //Chữ thường
      str = this.toLowerCase(str);
      //Lấy ngày giờ hiện tại
      var currentdate = new Date();
      var strcurrentdate = currentdate.getFullYear().toString()
      + (currentdate.getMonth() + 1).toString()
      + currentdate.getDate().toString()
      + currentdate.getHours().toString()
      + currentdate.getMinutes().toString()
      + currentdate.getSeconds().toString();

      str = str + strcurrentdate;

      return str;
  };
  this.randHex = function (len) {
      var maxlen = 16,
          min = Math.pow(16, Math.min(len, maxlen) - 1)
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
          n = Math.floor(Math.random() * (max - min + 1)) + min,
          r = n.toString(16);
      while (r.length < len) {
          r = r + randHex(len - maxlen);
      }
      return r;
  };
  this.randomJavaScript = function (length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  };
  this.showPopup = function (thiz) {
      //debugger
      var el = $(thiz);
      var value = el.val();
      var popup = "";
      if (Array.isArray(value) && value.length >= 1) {
          for (var i = 0; i < value.length; i++) {
              //debugger;
              if (value[i] === "ADDDATA") {
                  popup = el.attr('showpopup-control-adddata');
                  // thực hiện show popup
                  $(popup).modal({
                      backdrop: false,
                      keyboard: true
                  });
                  $(popup).modal('show');
                  el.val('');
                  el.trigger('change');
              }
              else if (value[i] === "UPDATEDATA") {
                  popup = el.attr('showpopup-control-updatedata');
                  // thực hiện show popup
                  $(popup).modal({
                      backdrop: false,
                      keyboard: true
                  });
                  $(popup).modal('show');
                  el.val('');
                  el.trigger('change');
              }
          }
      } else {

          if (el.val() === "ADDDATA" || value === '["ADDDATA"]') {
              popup = el.attr('showpopup-control-adddata');
              // thực hiện show popup
              $(popup).modal({
                  backdrop: false,
                  keyboard: true
              });
              $(popup).modal('show');
              el.val('');
              el.trigger('change');
          }
          else if (el.val() === "UPDATEDATA") {
              popup = el.attr('showpopup-control-updatedata');
              // thực hiện show popup
              $(popup).modal({
                  backdrop: false,
                  keyboard: true
              });
              $(popup).modal('show');
              el.val('');
              el.trigger('change');
          }
      }
  };
  this.getFilename = function (url) {
      var fileName = '';
      var ext = '';
      if (!this.isNullOrEmpty(url)) {
          var m = url.toString().match(/.*\/(.+?)\./);
          if (m && m.length > 1) {
              ext = url.substr(url.lastIndexOf('.') + 1);
              fileName = url.substr(url.lastIndexOf('/') + 1);
          }
      }
      var objFile = {};
      objFile.FileName = fileName;
      objFile.Ext = ext;
      return objFile;
  };
  this.convertExtFileToNumber = function (ext) {
      var number = '0';
      if (!this.isNullOrEmpty(ext)) {
          ext = this.returnValue(ext).toLowerCase();
          if (ext === 'xml') {
              number = '0';
          }
          else if (ext === 'doc' || ext === 'docx') {
              number = '1';
          }
          else if (ext === 'xls' || ext === 'xlsx') {
              number = '2';
          }
          else if (ext === 'pdf') {
              number = '3';
          }
      }
      return number;
  };

  //upload file/////////////
  this.getFileExt = function (filename) {
      var parts = filename.split('.');
      return parts[parts.length - 1];
  };

  this.isValidFileType = function (filename, types) {

      var ext = commonUtils.getFileExt(filename);


      if (types != undefined && types != null && types.length > 0) {
          types = types.toLowerCase();
          var parts = types.split(',');
          var ext1 = '.' + ext;
          for (var i = 0; i < parts.length; ++i) {
              var ti = parts[i];
              if (ti.length > 0) {
                  ti = ti.trim();
                  if (ti == ext || ti == ext || ti == ext1) {
                      return true;
                  }
              }
          }


      }
      else {


          ///default office image file types

          switch (ext.toLowerCase()) {
              case 'jpg':
              case 'gif':
              case 'bmp':
              case 'png':
              case 'jpeg':
              case 'doc':
              case 'docx':
              case 'xls':
              case 'xlsx':
              case 'pdf':
                  return true;
          }
      }

      return false;
  };

  this.callUpload = function (file, opt) {
      var listToastr = [];
      var message = '';
      var formData = new FormData();
      //formData.append('visitId', 'id');
      formData.append('file', file);

      $.ajax({

          url: opt.url,
          type: 'POST',
          dataType: 'json',
          xhr: function () {  // Custom XMLHttpRequest
              var myXhr = $.ajaxSettings.xhr();
              if (myXhr.upload) { // Check if upload property exists
                  //myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
              }
              return myXhr;
          },
          //Ajax events
          beforeSend: function () {

          },
          success: function (data) {
              if ($('#globalUploadFileInput').length > 0) {
                  $('#globalUploadFileInput').val('');
              }
              if (data.success) {
                  opt.success(data.data);
              }
              else {
                  if (opt.error) {
                      opt.error(data);
                  }
              }

          },
          error: function (e) {
              //showErrorMessage(e);
              //alert(e);
              message = e;
              objToastr = { ToastrType: 'error', ToastrMessage: message };
              listToastr.push(objToastr);
              commonUtils.showToastr(listToastr);

          },
          // Form data
          data: formData,
          //Options to tell jQuery not to process data or worry about content-type.
          cache: false,
          contentType: false,
          processData: false
      });
  };

  this.doUpload = function (file, opt) {
      var listToastr = [];
      var message = '';

      opt = opt || {};

      if (opt.url == undefined) {
          if (window.globalUploadFileUrl != undefined) {
              opt.url = window.globalUploadFileUrl;
          }
          else {
              opt.url = '/file/upload';
          }
      }
      if (opt.success == undefined) {
          opt.success = function (data) {
              //alert('upload done');
              message = 'Tải file lên thành công';
              objToastr = { ToastrType: 'success', ToastrMessage: message };
              listToastr.push(objToastr);
              commonUtils.showToastr(listToastr);
          };
      }
      if (opt.maxFileSize == undefined) {
          opt.maxFileSize = 10485760000; // 10mb

      }
      //if ((/image/i).test(file.type)) {
      if (commonUtils.isValidFileType(file.name, opt.fileTypes)) {


          if (file.size > opt.maxFileSize) {
              //alert('File size too big');
              message = 'File tải lên có dung lượng quá lớn';
              objToastr = { ToastrType: 'error', ToastrMessage: message };
              listToastr.push(objToastr);
              commonUtils.showToastr(listToastr);
              return false;
          } else {

              var settingsConfirm = {
                  title: 'Xác nhận',
                  yesBtnLabel: 'Đồng ý',
                  noBtnLabel: 'Bỏ qua',
                  no: function () {
                      $('#globalUploadFileInput').remove();
                  },
              };
              if (file.size > opt.fileSizeWarning) {
                  idnConfirm('File tải lên có dung lượng > 1mb. Bạn có muốn tiếp tục tải lên?', function () {
                      commonUtils.callUpload(file, opt);
                  }, settingsConfirm);
              } else {
                  commonUtils.callUpload(file, opt);
              }
          }
      } else {
          //some message for wrong file format
          message = 'File tải lên không được hỗ trợ';
          objToastr = { ToastrType: 'error', ToastrMessage: message };
          listToastr.push(objToastr);
          commonUtils.showToastr(listToastr);
          //alert('*Selected file format not supported!');
      }
  };

  this.uploadFile = function (opt) {

      if ($('#globalUploadFileInput') == undefined || $('#globalUploadFileInput').length == 0)
          $('<div style="width: 10px; margin-left: -10000px;"><form enctype="multipart/form-data" id="globalUploadFile"><input type="file" name="file" id="globalUploadFileInput" multiple="multiple" /></form></div>').appendTo($('body'));

      $('#globalUploadFileInput').attr("multiple", false);
      $('#globalUploadFileInput').unbind('change').bind('change', function (e) {
          var files = e.target.files || e.dataTransfer.files;
          if (files.length > 0) {
              debugger;
              //if (opt.isUpload === undefined || opt.isUpload === null) {
              //    opt.isUpload = true;
              //}
              //window.isUpload = opt.isUpload;
              commonUtils.doUpload(files[0], opt);
          }

      });

      $('#globalUploadFileInput').trigger('click');
  };

  //////////////

  this.getCookie = function (cname) {
      var allCookies = document.cookie;
      if (allCookies !== undefined && allCookies !== null && allCookies.length > 0) {
          var cookieArray = allCookies.split(';');
          if (cookieArray !== undefined && cookieArray !== null && cookieArray.length > 0) {
              for (var i = 0; i < cookieArray.length; i++) {
                  var cookieCur = cookieArray[i];
                  var cookieArrayCur = cookieCur.split('=');

                  var cookieName = cookieArrayCur[0];
                  var cookieValue = cookieArrayCur[1];
                  if (cookieName !== undefined && cookieName !== null && cookieName.toString().trim().length > 0) {
                      cookieName = cookieName.toString().trim();
                      if (cookieName === cname) {
                          if (cookieValue !== undefined && cookieValue !== null && cookieValue.toString().trim().length > 0) {
                              return cookieValue;
                          }
                      }
                  }
              }
          }
      }
      return "";
  };

  this.setCookie = function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  this.checkCookie = function (cname) {
      var cookieValue = getCookie(cname);
      if (!this.isNullOrEmpty(cookieValue)) {
          return true;
      }
      return false;
  };

  //// Tìm kiếm phần tử trong mảng
  this.findObjectInArr = function (arr, key) {
      if (arr !== undefined && arr !== null && arr.length > 0) {
          var obj = arr.find(x => x.Id === key);
          return obj;
      }
      else {
          return null;
      }
  };

  //// Xóa phần tử trong mảng
  this.removeObjectInArr = function (arr, key) {
      if (arr !== undefined && arr !== null && arr.length > 0) {
          var index = arr.findIndex(function (o) {
              return o.Id === key;
          })
          if (index !== -1) arr.splice(index, 1);
          return arr;
      }
      else {
          return null;
      }
  };






};

Date.prototype.formatDate = function (format) {
  var date = new Date(this.valueOf());
  var month = '' + (date.getMonth() + 1);
  var day = '' + date.getDate();
  var year = date.getFullYear();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  var strDate = '';
  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;
  var formatCur = 'yyyy-mm-dd';
  if (format !== undefined && format !== null && format.toString().trim().length > 0) {
      formatCur = format.toString().trim().toLowerCase();
  }
  switch (formatCur) {
      case 'yyyy-mm-dd':
          {
              strDate = [year, month, day].join('-');
              break;
          }
      case 'yyyy-mm-dd hh:mm:ss':
          {
              strDate = [year, month, day].join('-');
              var strTime = [hour, minute, second].join(':');
              strDate = strDate + ' ' + strTime;
              break;
          }
      default:
          {
              strDate = [year, month, day].join('-');
              break;
          }
  }
  return strDate;
}

$.fn.enterKey = function (fnc) {
  return this.each(function () {
      $(this).keypress(function (ev) {
          var keycode = (ev.keyCode ? ev.keyCode : ev.which);
          if (keycode == '13') {
              fnc.call(this, ev);
          }
      })
  })
}
var commonQContract = {};
commonQContract.ListMst_ColumnConfig = [];
commonQContract.UtcOffset = '';

ListMst_ColumnConfig = [];