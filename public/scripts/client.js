/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Function to consolidate all tweet elements
const renderTweets = function(tweets) {
  let htmlElement = '';
  for (const tweet of tweets.reverse()) {
    htmlElement += createTweetElement(tweet);
  }
  return htmlElement;
};

// Function to ensure user input doesn't get interpreted as code
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Function to create a new tweet element after form submission
const createTweetElement = function(tweet) {
  const name = tweet.user.name;
  const avatar = tweet.user.avatars;
  const handle = tweet.user.handle;
  const content = tweet.content.text;
  const daysAgo = Math.floor((new Date().getTime() - new Date(tweet.created_at).getTime()) / (1000 * 60 * 60 * 24));
  let createdAt = "Today";
  if (daysAgo === 1) {
    createdAt = daysAgo + " day ago";
  } else if (daysAgo > 1) {
    createdAt = daysAgo + " days ago";
  }

  const $tweet = `
  <article class="tweet">
    <header class="tweet">
      <div class="tweet-header">
          <span class="avatar"><img src="${escape(avatar)}"></span>
          <span>${escape(name)}</span>
      </div>
      <div class="tweet-header handle">${escape(handle)}</div>
    </header>
    <div class="tweet">${escape(content)}</div>
    <hr>
    <footer class="tweet">
      <div class="tweet-footer">
          <span>${createdAt}</span>
      </div>
      <div class="tweet-footer">
          <i class="fas fa-flag icon"></i>
          <i class="fas fa-retweet icon"></i>
          <i class="fas fa-heart icon"></i>
      </div>
    </footer>
  </article>
  `;

  return $tweet;
};

// jQuery funtions to update index.html
$(document).ready(function() {

  // Load all existing tweets on page load
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET",
    })
      .then(function(result) {
        const $tweet = renderTweets(result);
        $('#tweets-container').empty();
        $('#tweets-container').append($tweet);
      });
  };
  loadTweets();

  // When a new tweet is submitted, display the tweet in the body without requiring a page refresh
  $("form.new-tweet").on('submit', function(event) {
    event.preventDefault();

    const tweet = $('form.new-tweet').serialize();
    const tweetBody = $('textarea.new-tweet').val();

    if (!tweetBody) {  // Validate that tweet is not empty
      $("#error").empty();
      $("#error").append('<i class="fas fa-exclamation-triangle"></i>Type in your tweet before submitting!');
      $("#error").removeClass("hide");
      $("#error").addClass("show");
    } else if (tweetBody.length > 140) {  // Validate that tweet is not over 140 characters
      $("#error").empty();
      $("#error").append('<i class="fas fa-exclamation-triangle"></i>Your tweet is too long! Character limit is 140.');
      $("#error").removeClass("hide");
      $("#error").addClass("show");
    } else {  // Post valid tweet
      $("#error").empty();
      $("#error").removeClass("show");
      $("#error").addClass("hide");
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: tweet,
        success: loadTweets
      });
      $("textarea.new-tweet").val('');
      $("textarea.new-tweet").parent().children("div").children("output").val(140);
    }
  });

});