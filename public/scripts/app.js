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


var data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

$(document).ready(function() {

  function loadTweets() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        renderAllTweets(data, renderTweet, $(".tweet-log"));
      }
    });
  }

  loadTweets();

  function showFlash(flash, message, timeout) {
    flash.text(message);
    flash.slideDown(function() {
      setTimeout(function() {
        flash.slideUp();
      }, timeout);
    });
  }

  const $form = $('#create-tweet');
  //TODO: DRY?
  $form.find("#submit-tweet").on('click', function(event) {
    event.preventDefault();
    const charMax = 140;
    const $flash = $form.find(".newtweet-flash");
    const flashTimeout = 3000;
    const $typed = $form.find(".newtweet-textarea").val().length;
    if ($typed && $typed <= charMax) {
      $.ajax({
        data: $form.serialize(),
        method: 'POST',
        success: function() {
          loadTweets();
          $form[0].reset();
          $form.find(".newtweet-counter").text(charMax);
        },
        url: '/tweets'
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
