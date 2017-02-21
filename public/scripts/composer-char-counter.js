$(document).ready(function() {
  const charMax = 140;
  $(".newtweet-textarea").on("input", function() {
    const typed = Number($(this).val().length);
    const charSpan = $(this).closest("form").find(".newtweet-counter");
    charSpan.text(charMax - typed);
    const isOkay = typed <= charMax;
    if (isOkay) {
      charSpan.removeClass("danger");
    } else {
      charSpan.addClass("danger");
    }
  });
});
