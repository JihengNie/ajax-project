var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-hidden');
var windowCurrentSize = window.innerWidth;
var $searchResults = document.querySelector('.search-results');

window.addEventListener('resize', searchBarDisplay);

// Used for showing the correct search bar based on current window size
if (windowCurrentSize > 768) {
  $mobileSearch.className = 'hidden';
  $windowSearch.className = 'column-one-third search-bar-background window-search-hidden';
} else {
  $windowSearch.className = 'hidden';
  $mobileSearch.className = 'column-one-third search-bar-background window-search-hidden';
}

// Used for showing the correct search bar based on window size change
function searchBarDisplay(event) {
  if (window.innerWidth > 768) {
    $mobileSearch.className = 'hidden';
    $windowSearch.className = 'column-one-third search-bar-background window-search-hidden';
  } else {
    $windowSearch.className = 'hidden';
    $mobileSearch.className = 'column-one-third search-bar-background window-search-hidden';
  }
}

function truncateTexts(text) {
  var threeLines = 200;
  if (!text) {
    return;
  }
  if (text.length >= threeLines) {
    text = text.slice(0, threeLines) + '...';
  }
  return text;
}
truncateTexts();

// Used to avoid CORS error
function getYugiohDataFuzzy(fuzzyCardName) {
  var tempData;
  var tempDomTree;
  var searchText = fuzzyCardName.split(' ').join('%20');
  var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + searchText);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    tempData = xhr.response;
    var maxLength = 5; // Can use later to modify how many search results are displayed
    if (maxLength > tempData.data.length) {
      maxLength = tempData.data.length;
    }
    for (var i = 0; i < maxLength; i++) {
      tempDomTree = generateSearchCard(tempData, i);
      $searchResults.appendChild(tempDomTree);
    }
  });
  xhr.send();
}

getYugiohDataFuzzy('Blue-Eyes');

function generateDomTree(tagName, attributes, children = []) {
  var element = document.createElement(tagName);
  for (var key in attributes) {
    if (key === 'textContent') {
      element.textContent = attributes.textContent;
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  for (var i = 0; i < children.length; i++) {
    element.append(children[i]);
  }
  return element;
}

function generateSearchCard(cardData, i = 0) {
  var DOMTree = generateDomTree('div', { class: 'column-half' }, [
    generateDomTree('div', { class: 'search-card' }, [
      generateDomTree('div', { class: 'image-holder' }, [
        generateDomTree('img', { class: 'card-image', src: cardData.data[i].card_images[0].image_url })
      ]),
      generateDomTree('div', { class: 'card-text' }, [
        generateDomTree('h3', { textContent: cardData.data[i].name }),
        generateDomTree('p', { class: 'truncate', textContent: truncateTexts(cardData.data[i].desc) })
      ])
    ])
  ]);
  return DOMTree;
}
