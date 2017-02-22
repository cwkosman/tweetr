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
    unit: 'hour'
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

function createTweetElement(database) {
  //Destructuring in ES6
  // const {name, avatars} = database.user
  //Split into seperate functions
  let $tweetImage = $('<img>', {
    "class": "tweet-avatar",
    src: database.user.avatars.small
  });
  let $tweetPoster = $('<h2></h2>', {
    "class": "tweet-poster",
    text: database.user.name
  });
  let $tweetHandle = $('<p></p>', {
    "class": "tweet-handle",
    text: database.user.handle
  });
  let $tweetHeader = $('<header class="tweet-header"></header>').append($tweetImage, $tweetPoster, $tweetHandle);
  let $tweetBody = $('<p></p>', {
    "class": "tweet-content",
    text: database.content.text
  });
  let $tweetAge = $('<p></p>', {
    "class": "tweet-age",
    text: `${timeSince(database.created_at)} ago`
  });
  let $tweetIcons = $('<div class="tweet-icons">\n<span class="fa fa-flag"></span><span class="fa fa-retweet"> </span><span class="fa fa-heart"> </span></div>');
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
    const $flash = $form.find("newtweet-flash");
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

});
