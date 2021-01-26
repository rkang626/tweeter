$(document).ready(function() {
  $("textarea.new-tweet").on("input", function() {
    $(this).parent().children("div").children("output").val(140 - $(this).val().length);
    $(this).parent().children("div").children("output").attr("counterColor", (140 - $(this).val().length) > 0 ? "default" : "red");
    $(this).height(0);
    $(this).height(this.scrollHeight);
  });
});