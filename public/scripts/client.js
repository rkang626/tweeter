/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function(tweets) {
  let htmlElement = '';
  for (tweet of tweets) {
    htmlElement += createTweetElement(tweet);
  }
  return htmlElement;
}

const createTweetElement = function(tweet) {
  const name = tweet.user.name;
  const avatar = tweet.user.avatars;
  const handle = tweet.user.handle;
  const content = tweet.content.text;
  const daysAgo = Math.floor((new Date().getTime() - new Date(tweet.created_at).getTime()) / (1000 * 60 * 60 * 24));

  const $tweet = `
  <article class="tweet">
    <header class="tweet">
      <div class="tweet-header">
          <span style="padding-right: 0.5em;"><img src="${avatar}" style="width:40px;height:40px;"></span>
          <span>${name}</span>
      </div>
      <div class="tweet-header handle">${handle}</div>
    </header>
    <div class="tweet">${content}</div>
    <hr>
    <footer class="tweet">
      <div class="tweet-footer">
          <span>${daysAgo} days ago</span>
      </div>
      <div class="tweet-footer">
          <i class="fas fa-flag icon"></i>
          <i class="fas fa-retweet icon"></i>
          <i class="fas fa-heart icon"></i>
      </div>
    </footer>
  </article>
  `

  return $tweet;
}

$(document).ready(function() {

  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET",
    })
    .then(function(result) {
      const $tweet = renderTweets(result);
      $('#tweets-container').append($tweet); 
    });
  }

  loadTweets()

  $("form.new-tweet").on('submit', function (event) {
    event.preventDefault();

    const tweet = $('form.new-tweet').serialize();
    const tweetBody = $('textarea.new-tweet').val();
    console.log(tweetBody);

    if (!tweetBody) {
      alert("invalid input");
    } else if (tweetBody.length > 140) {
      alert("too long");
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: tweet
      })
    }

  })

})
