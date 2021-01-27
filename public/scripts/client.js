/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function(tweets) {
  let htmlElement = '';
  for (tweet of tweets.reverse()) {
    htmlElement += createTweetElement(tweet);
  }
  return htmlElement;
}

const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
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
          <span style="padding-right: 0.5em;"><img src="${escape(avatar)}" style="width:40px;height:40px;"></span>
          <span>${escape(name)}</span>
      </div>
      <div class="tweet-header handle">${escape(handle)}</div>
    </header>
    <div class="tweet">${escape(content)}</div>
    <hr>
    <footer class="tweet">
      <div class="tweet-footer">
          <span>${escape(daysAgo)} days ago</span>
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

    if (!tweetBody) {
      $("#error").empty();
      $("#error").append('<span><i class="fas fa-exclamation-triangle"></i></span><span>Type in your tweet before submitting!</span><span><i class="fas fa-exclamation-triangle"></i></span>');
      $("#error").removeClass("hide");
      $("#error").addClass("show");
    } else if (tweetBody.length > 140) {
      $("#error").empty();
      $("#error").append('<span><i class="fas fa-exclamation-triangle"></i></span><span>Your tweet is too long! Character limit is 140.</span><span><i class="fas fa-exclamation-triangle"></i></span>');
      $("#error").removeClass("hide");
      $("#error").addClass("show");
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: tweet,
        success: setTimeout(loadTweets, 1000)
      })
    }
  }) 

})