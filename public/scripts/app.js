function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;
  const secondsPerMonth = secondsPerDay * 30;
  const secondsPerYear = secondsPerDay * 365;
  const intervals = [{
    seconds: secondsPerYear,
    unit: 'years'
  }, {
    seconds: secondsPerMonth,
    unit: 'months'
  }, {
    seconds: secondsPerDay,
    unit: 'days'
  }, {
    seconds: secondsPerHour,
    unit: 'hours'
  }, {
    seconds: secondsPerMinute,
    unit: 'minutes'
  }];
  //TODO DRY and/or 'just now'
  let chosenInterval = intervals.find(function (entry) {
    return Math.floor(seconds / entry.seconds) >= 1;
  }) || { seconds: 1, unit: 'seconds' };
  return `${Math.floor(seconds / chosenInterval.seconds)} ${chosenInterval.unit}`;
}

function createTweetElement(tweetData) {
  //Destructuring in ES6
  // const {name, avatars} = tweetData.user
  //Split into seperate functions
  const $tweetImage = $('<img>', {
    "class": "tweet-avatar",
    src: tweetData.user.avatars.small
  });
  const $tweetPoster = $('<h2></h2>', {
    "class": "tweet-poster",
    text: tweetData.user.name
  });
  const $tweetHandle = $('<p></p>', {
    "class": "tweet-handle",
    text: tweetData.user.handle
  });
  const $tweetHeader = $('<header class="tweet-header"></header>').append($tweetImage, $tweetPoster, $tweetHandle);
  const $tweetBody = $('<p></p>', {
    "class": "tweet-content",
    text: tweetData.content.text
  });
  const $tweetAge = $('<p></p>', {
    "class": "tweet-age",
    text: `${timeSince(tweetData.created_at)} ago`
  });
  const $tweetIcons = $('<ul class="tweet-icons"></ul>');
  const $iconShare = $('<li class="fa fa-share"></li>');
  const $iconRetweet = $('<li class="fa fa-retweet"></li>');
  const $iconLike = $(`<li class="fa fa-heart like-tweet"></li>`).attr({"data-id": tweetData._id, "data-liked": tweetData.liked});
  if (tweetData.liked) {
    $iconLike.addClass("tweet-liked");
  }
  const $tweetLikes = $('<span class="tweet-likes"></span>').text(tweetData.likes);
  $tweetIcons.append($iconShare, $iconRetweet, $iconLike, $tweetLikes);
  let $tweetFooter = $('<footer class="tweet-footer"></footer>').append($tweetAge, $tweetIcons);
  return $('<article class="tweet"></article>').append($tweetHeader, $tweetBody, $tweetFooter);
}

function renderTweet(tweet, tweetLog) {
  createTweetElement(tweet).prependTo(tweetLog);
}

function renderAllTweets(data, cb, location) {
  data.forEach(entry => cb(entry, location));
}

$(document).ready(function() {
  function loadTweets() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json'
    }).then(data => renderAllTweets(data, renderTweet, $(".tweet-log")));
  }

  loadTweets();

  function showFlash(flashElement, message, timeout) {
    flashElement.text(message);
    flashElement.slideDown(function() {
      setTimeout(function() {
        flashElement.slideUp();
      }, timeout);
    });
  }


  $("#submit-tweet").on('click', function(event) {
    event.preventDefault();
    const $form = $(this).closest("#create-tweet");
    const $flash = $form.find(".newtweet-flash");
    const charMax = 140;
    const flashTimeout = 3000;
    const $typed = $form.find(".newtweet-textarea").val().length;
    if ($typed && $typed <= charMax) {
      $.ajax({
        data: $form.serialize(),
        method: 'POST',
        url: '/tweets'
      }).then(() => {
        $(".tweet-log").empty();
        loadTweets();
        $form[0].reset();
        $form.find(".newtweet-counter").text(charMax);
      });
    } else if (!$typed) {
      showFlash($flash, "Nothing typed!", flashTimeout);
    } else if ($typed > charMax) {
      showFlash($flash, "Too long, blabbermouth!", flashTimeout);
    }
  });

  $(".navbar-compose").on("click", function() {
    const $newTweet = $(".newtweet");
    $newTweet.slideToggle("fast");
    $newTweet.find(".newtweet-textarea").focus();
  });

  $("#tweet-log").on("click", ".like-tweet", function () {
    const isLiked = $(this).data("liked");
    if (isLiked) {
      $(this).data("liked", "");
      $(this).removeClass("tweet-liked");
      $(this).closest(".tweet-icons").find(".tweet-likes").html(function(i, val) { return Number(val) - 1; } );
    } else if (!isLiked) {
      $(this).data("liked", true);
      $(this).addClass("tweet-liked");
      $(this).closest(".tweet-icons").find(".tweet-likes").html(function(i, val) { return Number(val) + 1; } );
    }
    $.ajax({
      data: {"tweetId": $(this).data("id"),
        "isLiked": isLiked },
      method: 'POST',
      url: '/tweets/like'
    });
  });
});
