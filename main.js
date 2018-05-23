$(document).ready(function(){
  
  var $feed = $('.feed-home');
  $feed.html('');
  var feedLength = streams.home.length;

  var makeNametagDiv = function (tweetObj){
    //create nametag div containing user name
    var $user = $(`<div class="nametag ${tweetObj.user}"></div>`);
    $user.text('@' + tweetObj.user);

    return $user;
  }

  var makeTimestampDiv = function (tweetObj){
    //create timestamp div containing age of tweet
    var currentTime = new Date();
    var $timestamp = $('<div class="timestamp"></div>');
    $timestamp.text(moment().format("DD MMM, YYYY  HH:MM a"));

    return $timestamp;
  }

  var makeMessageDiv = function(tweetObj){
    //create message div containing tweet message
    var $message = $('<div class="message"></div>');
    $message.text(tweetObj.message);

    return $message;
  }

  var addTweetToContainer = function(tweetObj){
    //create container for each tweet, append tweet elements to it
    var $tweetContainer = $('<div class="tweet-container"></div>');
    makeNametagDiv(tweetObj).appendTo($tweetContainer);
    makeTimestampDiv(tweetObj).appendTo($tweetContainer);
    makeMessageDiv(tweetObj).appendTo($tweetContainer);

    return $tweetContainer;
  }

  var pushTweetsToFeed = function (currentIndex, endIndex){
    //add tweets of given index to last index of streams.home 
    //to top of feed
    while (currentIndex < endIndex){
      var tweet = streams.home[currentIndex];
      addTweetToContainer(tweet).prependTo($feed);
      currentIndex++;
    }
  }

  var pushUserTweetsToFeed = function (username, currentIndex, endIndex){
    //add all tweets belonging to user to user-feed
    while (currentIndex < endIndex){
      var tweet = streams.users[username][currentIndex];
      addTweetToContainer(tweet).prependTo($('.feed-user'));
      currentIndex++;
    }
  }

  var displayUserTweets = function (event){
    //assemble user feed, make user feed container visible, and fade main feed
    var $userFeed = $('.feed-user');
    $userFeed.html('');
    var username = $(this).attr('class').split(' ')[1];
    var userFeedLength = streams.users[username].length;

    pushUserTweetsToFeed(username, 0, userFeedLength);

    $('.main-feed-container').css({'opacity': 0.1});
    $('.scrollbox-user').css({'left': event.clientX}).fadeIn('fast');
    $('.feed-user').css({'visibility':'visible'});

  }

  var closeUserTweets = function (){
    //close user tweet container and refresh main feed
    $('.main-feed-container').css({'opacity':1});
    $('.scrollbox-user').css({'display':'none'});
    refreshFeed();
  }

  var refreshFeed = function (){
    //add tweets not yet displayed to top of feed
    var index = feedLength;
    feedLength = streams.home.length;
    pushTweetsToFeed(index, feedLength);
  }

  var getVisitorTweet = function(){
    return {user: 'anonymous', 
      message: $('#visitor-tweet').val(),
      created_at: moment.now()};
  }

  var pushTweetToStream = function (tweetObj){
    streams.visitor.push(tweetObj);
    streams.home.push(tweetObj);
  }

  var addVisitorTweetToFeed = function(){
    var tweet = getVisitorTweet();
    pushTweetToStream(tweet);
    refreshFeed();
    $('#visitor-tweet').val('');
  }
  
  //add click listener to refresh button
  $('#refresh-button').click(refreshFeed);
  $('#header').click(refreshFeed);
  $('#close-button').click(closeUserTweets);
  $(document).on('click', '.nametag', displayUserTweets);
  $('#submit-button').click(addVisitorTweetToFeed);

  //first batch of tweets
  pushTweetsToFeed(0, feedLength);

});
