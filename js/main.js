var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-bar');
var $searchResultFeed = document.querySelector('.search-results');
var $singleCardName = document.querySelector('.single-card-name');
var $singleCardImage = document.querySelector('.single-card-image');
var $singleCardText = document.querySelector('.single-card-text');
var $singleAmazon = document.querySelector('.single-amazon');
var $singleCardMarket = document.querySelector('.single-cardmarket');
var $singleEbay = document.querySelector('.single-ebay');
var $singleCoolstuff = document.querySelector('.single-coolstuff');
var $singleTCG = document.querySelector('.single-tcg');
var $singleView = document.querySelector('.single-view');
var $addButton = document.querySelector('.add-button');

var deckData = {
  cards: [],
  previousSearch: ''
};

// Event Handlers
$mobileSearch.addEventListener('submit', mobileSearching);
$windowSearch.addEventListener('submit', windowSearching);
$searchResultFeed.addEventListener('click', detailedCardView);
$addButton.addEventListener('click', storeingCurrentData);

// Event Hangler functions
function storeingCurrentData(event) {
  deckData.cards.push($singleCardName.textContent);
  $singleView.className = 'hidden';
  $mobileSearch.className = 'column-one-third search-bar-background mobile-search-hidden';
  $searchResultFeed.className = 'row search-results';
  resetSearchResults();
  getYugiohDataFuzzy(deckData.previousSearch);
}

function detailedCardView(event) {
  if (event.target.tagName === 'H3') {
    $singleView.className = 'container single-view';
    $mobileSearch.className = 'hidden';
    $searchResultFeed.className = 'hidden';
    getYugiohDataExact(event.target.textContent);
  }
}

function mobileSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($mobileSearch.elements.search.value);
  deckData.previousSearch = $mobileSearch.elements.search.value;
  resetSearchResults();
  $mobileSearch.reset();
}

function windowSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($windowSearch.elements.search.value);
  deckData.previousSearch = $windowSearch.elements.search.value;
  resetSearchResults();
  $windowSearch.reset();
}

// Other functions
function resetSearchResults() {
  while ($searchResultFeed.firstChild) {
    $searchResultFeed.removeChild($searchResultFeed.firstChild);
  }
}

// Used for exact name search
function getYugiohDataExact(exactCardName) {
  var tempData;
  var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + exactCardName);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    tempData = xhr.response;
    populatingSingleView(tempData);
  });
  xhr.send();
}

function populatingSingleView(cardData) {
  $singleCardName.textContent = cardData.data[0].name;
  $singleCardImage.src = cardData.data[0].card_images[0].image_url;
  $singleCardText.textContent = cardData.data[0].desc;
  $singleAmazon.textContent = '$' + cardData.data[0].card_prices[0].amazon_price;
  $singleCardMarket.textContent = '$' + cardData.data[0].card_prices[0].cardmarket_price;
  $singleEbay.textContent = '$' + cardData.data[0].card_prices[0].ebay_price;
  $singleCoolstuff.textContent = '$' + cardData.data[0].card_prices[0].coolstuffinc_price;
  $singleTCG.textContent = '$' + cardData.data[0].card_prices[0].tcgplayer_price;
}

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
    if (tempData.error) {
      generateNoResultSearchCard();
      return;
    }
    var maxLength = 5; // Can use later to modify how many search results are displayed
    if (maxLength > tempData.data.length) {
      maxLength = tempData.data.length;
    }
    for (var i = 0; i < maxLength; i++) {
      tempDomTree = generateSearchCard(tempData, i);
      $searchResultFeed.appendChild(tempDomTree);
    }
  });
  xhr.send();
}

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

function generateNoResultSearchCard() {
  var DOMTree = generateDomTree('div', { class: 'column-half' }, [
    generateDomTree('div', { class: 'search-card' }, [
      generateDomTree('div', { class: 'image-holder' }, [
        generateDomTree('img', { class: 'card-image', src: 'images/Sheep.png' })
      ]),
      generateDomTree('div', { class: 'card-text' }, [
        generateDomTree('h3', { textContent: 'No results found' })
      ])
    ])
  ]);
  $searchResultFeed.appendChild(DOMTree);
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
