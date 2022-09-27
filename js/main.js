var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-hidden');
var windowCurrentSize = window.innerWidth;
var $listOfCardTexts = document.querySelectorAll('.truncate');
var $searchResults = document.querySelector('.search-results');
// Use Queryselector for a column-half element and populate the data from my API

window.addEventListener('resize', searchBarDisplay);

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

// Used for showing the correct search bar based on current window size
if (windowCurrentSize > 768) {
  $mobileSearch.className = 'hidden';
  $windowSearch.className = 'column-one-third search-bar-background window-search-hidden';
} else {
  $windowSearch.className = 'hidden';
  $mobileSearch.className = 'column-one-third search-bar-background window-search-hidden';
}

// Used for truncating texts
function truncateTexts() {
  var threeLines = 200;
  for (var i = 0; i < $listOfCardTexts.length; i++) {
    if ($listOfCardTexts[i].textContent.length >= threeLines) {
      $listOfCardTexts[i].textContent = $listOfCardTexts[i].textContent.slice(0, threeLines) + '...';
    }
  }
}
truncateTexts();

// Used to avoid CORS error
function getYugiohData(cardName) {
  var tempData;
  var tempDomTree;
  var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + cardName);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    tempData = xhr.response;
    tempDomTree = generateSearchCard(tempData);
    $searchResults.appendChild(tempDomTree);
  });
  xhr.send();
}

getYugiohData('Blue-Eyes White Dragon');
getYugiohData('Kuriboh');

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

function generateSearchCard(cardData) {
  var DOMTree = generateDomTree('div', { class: 'column-half' }, [
    generateDomTree('div', { class: 'search-card' }, [
      generateDomTree('div', { class: 'image-holder' }, [
        generateDomTree('img', { class: 'card-image', src: cardData.data[0].card_images[0].image_url })
      ]),
      generateDomTree('div', { class: 'card-text' }, [
        generateDomTree('h3', { textContent: cardData.data[0].name }),
        generateDomTree('p', { textContent: cardData.data[0].desc })
      ])
    ])
  ]);
  return DOMTree;
}
