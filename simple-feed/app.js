(function (window) {
    var util = window.util;

    var API_BASE_URL = 'http://data.digg.com/api/v1/feed/trending/tweets';


    // An array of available feeds
    var FEEDS = [
        { slug: 'digg' },
        { slug: 'david_picks' },
        { slug: 'politics' },
        { slug: 'design' }
    ];

    // Todo: store user's preference from last time in cookie
    var SELECTED_FEED = 'digg';

    /**
     * Displays available feed buttons
     */

    function displayFeedButtons(list) {
        list.forEach(renderButton);
    }

    function renderButton(element, index, array) {
        var buttonContainer = document.getElementById('button-container'),
            button = document.createElement('button'),
            slug = element.slug;

        if (slug == SELECTED_FEED) {
            button.className = 'selected';
        }

        button.setAttribute('data-slug', slug);
        button.innerHTML = (slug).replace(/_/g, ' ');

        button.onclick = function() {
            selectFeed(this.getAttribute('data-slug'));
        }

        buttonContainer.appendChild(button);
    }

    displayFeedButtons(FEEDS);

    /**
     * Fetches stories from a feed
     */

    function renderFeed() {
        util.ajax({
            url: API_BASE_URL,
            data: {
                group: SELECTED_FEED,
            },
            success: function (data) {
                console.log('Success!');
                eraseFeed();
                displayFeed(data);
            },
            error: function (responseText) {
                // Todo: Add logging?
                console.log('Error! :(', responseText);
            }
        });
    }


    function eraseFeed() {
        document.getElementById('feed-container').innerHTML = '';
    }

    function displayFeed(data) {
        var stories = data.mesg;
        var MAX_LENGTH = 5;

        for(var i = 0; i < MAX_LENGTH; i++) {
            displayStory(stories[i]);
        }
    };

    renderFeed();

    function displayStory(story) {
        if (story.media.images.length > 0 ) {

        }

        //Todo: Sort stories by date before rendering on page

        var article = document.createElement('article');
        var feedContainer = document.getElementById('feed-container');

        if (story.media.images.length > 0) {
            article.innerHTML = '<a href= ' + story.url + ' target="_blank"><div class="story">' +
                    '<div class="story-image" style="background-image: url(' +
            story.media.images[0].url +')"></div>' +
            '<h2 class="story-title">' +
            story.title + '</h2><p class="description">' +
            story.description + '</p></div></a>';

        } else {
            // Todo: Dry this out, whoops!
            article.innerHTML = '<a href= ' + story.url + ' target="_blank"><div class="story"><h2 class="story-title">' +
            story.title + '</h2><p class="description">' +
            story.description + '</p></div></a>';
        }


        feedContainer.appendChild(article);
    }

    /**
     * Handle changes when user selects new feed
     */

    function selectFeed(feed) {

        // Change the stories
        SELECTED_FEED = feed;
        console.log(feed);
        var newlySelected = document.querySelectorAll('[data-slug=' + feed + ']')[0];
        renderFeed();

        // Change button appearances
        document.getElementsByClassName('selected')[0].className = document.getElementsByClassName('selected')[0].className.replace(/\bselected\b/,'');
        newlySelected.className += 'selected';


    }


})(this);
