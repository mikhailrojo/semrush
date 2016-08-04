// убрал самовызывающуюся функцию и сделал все var переменные публичными в целях тестирования
// либо все переменные закрыты и к ним нет доступа и их не протестируешь, либо делать их публичными

"use strict";

var InputView = Backbone.View.extend({

  events: {
    'click #tagInput': 'focusOnInputField',
    'keydown #inputField' : 'keyDown',
    'keyup #inputField' : 'keyUp',
  },

  myTemplate: _.template($("#mainContent").html()),

  render: function(){
    this.$el.html(this.myTemplate(this.model.attributes));
    return this;
  },

  focusOnInputField: function(){
    this.$("#inputField").focus();
  },

  internalVariable: null, // служит чтобы проверять и не делать запросы к базе данных чаще чем раз в полсекунды

  keyDown: function(e){
    this._escPressed(e);
  },


  keyUp: function(e){
    var newInput = this.$("#inputField").val();
    if(newInput.length > 0 && e.keyCode != 13 | e.which != 13){
      this._otherThanEnterPressed(newInput);
    }
    if(newInput.length > 18){
      this._tooLongInput();
    }
    if (e.keyCode === 13 | e.which === 13){
        this._enterPressed(newInput);
    }
  },



  returnedDataFromServer: null,

  xhrRequest : function(newInput, that){
    if(!that.returnedDataFromServer){
      $.ajax({
        method: "GET",
        url: "data.json"
      }).done(function(data){
        console.log("запрос к базе"); // для того чтобы в консоли видеть сколько запросов к базе было предпринято
        that.returnedDataFromServer = data;
        that.createChoices(data, newInput, that);
      });
    } else{
      console.log("запрос к кэшу"); // для того чтобы в консоли видеть сколько запросов к кэ было предпринято
      that.createChoices(that.returnedDataFromServer, newInput, that);
    }
  },

  createChoices: function(names, newInput, that){
    var regExp = new RegExp(newInput, "i");
    var suggestionsUl = this.$("#suggestions");
    var createNewTag = that.createNewTag;
    suggestionsUl.children().remove();

    for(var i = 0; i < names.length; i ++){
      if(names[i].match(regExp)){
        var li = document.createElement("li")
        li.addEventListener("click", function(e){
          createNewTag(e.target.innerText);
          $("#inputField").val("");
          suggestionsUl.children().remove();
        });
        li.innerText = names[i];
        suggestionsUl.append(li);
      }
    }
  },

  createNewTag: function(newInput){
    var li = document.createElement("li");
    var span = document.createElement("span");
    var ul = document.getElementById("tagUl");
    span.innerHTML = "&times;";
    span.addEventListener("click", function(e){
      ul.removeChild(e.target.parentNode);
    });
    span.className = "cross";
    li.className = "tag";
    li.innerHTML = newInput;
    li.appendChild(span);
    ul.insertBefore(li, inputLi);
    $("#inputField").focus();
  },
  _escPressed: function(e){
    var ul = this.$("#tagUl");
    var elementToDelete = ul.children().length - 2;
    if( !this.$("#inputField").val() && ul.children().length>  1 &&  e.keyCode === 8 | e.which === 8 ){
       //если нажать Esc - удаляем последнюю запись(работает когда есть что то в инпуте)
       ul.children()[elementToDelete].remove();
    }
  },

  _otherThanEnterPressed: function(newInput){
    if(!this.intervalVariable){
      this._timeoutXhr(newInput);
    }else{
      clearInterval(this.intervalVariable);
      this._timeoutXhr(newInput);
    }
  },

  _timeoutXhr: function(newInput){
    var xhrRequest = this.xhrRequest;
    var intVar = this.intervalVariable;
    var that = this;
    this.intervalVariable = setTimeout(function(){
      intVar = null;
      if(this.$("#inputField").val()){
        xhrRequest(newInput, that);
      }
    }, 500)
  },

  _tooLongInput: function(){
    var value = $("#inputField").val();
    this.$("#inputField").val(value.substr(0,18));
    if(!$("#warning").length){
      $("#wrapper").append("<p id='warning'>Просим не вводить больше 18 символов</p>");
      $("p#warning").css({color: 'red', position: 'absolute'}).fadeOut(3000,function(){
        $(this).remove();
      });
    }
  },

  _enterPressed: function(newInput){
    this.$("#suggestions").html("");
    if (!newInput) return;
    this.createNewTag(newInput);
    this.$("#inputField").val("");
  }
});


var myModel = new Backbone.Model({
  h1: "Заведение тэгов для Семруш",
  p: "Вводите в поле мужские и женские имена для добавления к выбранным:",
  line1 : '*Сервер возвращает следующие имена: "Миша", "Алексей", "Владимир", "Тимофей", "Захар", "Матифей", "Леонид", "Александр", "Алеша", "Алек", "Татьяна", "Елена", "Нина", "Марина", "Елизавета"',
  line2 : '*Для проверки работы, попробуйте начать вбивать любые буквы имени, и сервер предложит доступные варианты',
  line3 : '*Имя возвращается тегом при нажатии Enter, либо при нажатии на выбранное имя из списка'
});
var view = new InputView({model: myModel});

$("#main").append(view.render().el);
