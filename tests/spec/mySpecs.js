describe("Общие тесты", function(){
  var testView;

  describe("Вью рендериться на страницу", function(){

    beforeEach(function(){
      var testModel = new Backbone.Model({h1: "test h1", p: "Test p", line1: "test line1", line2: "test line2", line3: "test line 3"});
      testView = new InputView({model: testModel});
      testView.render();
    });

      it("Вью рендериться в виде дива", function() {
        expect(testView.el.tagName).toBe("DIV");
      });
      it("Внутри дива есть одно поле инпут с айди inputField", function() {
        expect(testView.$el.find("input#inputField").length).toBe(1);
      });
      it("Внутри дива <%=h1%> действительно равен атрибуту модели h1", function() {
        expect(testView.$el.find("h1").text()).toBe(testView.model.get("h1"));
      });
      it("Внутри дива h1 равен именно 'test h1'", function() {
        expect(testView.$el.find("h1").text()).toBe('test h1');
      });
  });
});
