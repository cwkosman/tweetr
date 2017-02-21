$(document).ready(function() {
  const charMax = 140;
  $(".newtweet-textarea").on("keyup", function() {
    let typed = Number($(this).val().length);
    let charSpan = $(this).closest("form").find(".newtweet-counter");
    charSpan.text(charMax - typed);
    let isOkay = typed <= charMax;
    if (isOkay) {
      charSpan.removeClass("danger");
    } else {
      charSpan.addClass("danger");
    }
  });
});
