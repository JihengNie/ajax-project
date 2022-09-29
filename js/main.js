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
var $deckList = document.querySelector('.deck-style');
var $deckButton = document.querySelector('.deck-button');
var $deckContainer = document.querySelector('.deck-view');
var $headerSearchButton = document.querySelector('.head-search-button');
var previousDeckData = localStorage.getItem('Deck-Data-local-storage');
var $deckPrice = document.querySelector('.deck-price');

var deckData = {
  cards: [],
  previousSearch: '',
  nextEntryID: 0,
  price: 0.0
};

if (previousDeckData) {
  deckData = JSON.parse(previousDeckData);
}

// Event Handlers
$mobileSearch.addEventListener('submit', mobileSearching);
$windowSearch.addEventListener('submit', windowSearching);
$searchResultFeed.addEventListener('click', detailedCardView);
$addButton.addEventListener('click', storeingCurrentData);
$deckButton.addEventListener('click', viewingDeck);
$headerSearchButton.addEventListener('click', viewingSearch);
$deckList.addEventListener('click', cardInDeckDetails);
window.addEventListener('DOMContentLoaded', deckLoad);
window.addEventListener('beforeunload', storingDeckData);
window.addEventListener('pagehide', storingDeckDataPageHide);

// Event Hangler functions
function storingDeckData(event) {
  var deckDataStringify = JSON.stringify(deckData);
  localStorage.setItem('Deck-Data-local-storage', deckDataStringify);
}

function storingDeckDataPageHide(event) {
  var deckDataStringify = JSON.stringify(deckData);
  localStorage.setItem('Deck-Data-local-storage', deckDataStringify);
}

function deckLoad(event) {
  resetDeckResults();
  $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;
  appendingCardImageToDeckURL();
}

function cardInDeckDetails(event) {
  if (event.target.tagName === 'IMG') {
    getYugiohDataExact(event.target.name);
    $singleView.className = 'container single-view';
    $mobileSearch.className = 'hidden';
    $searchResultFeed.className = 'hidden';
    $deckContainer.className = 'container deck-view hidden';
  }
}

function viewingSearch(event) {
  $deckContainer.className = 'container deck-view hidden';
  $singleView.className = 'container single-view hidden';
  $searchResultFeed.className = 'row search-results';
  $mobileSearch.className = 'column-one-third search-bar-background mobile-search-hidden';
  resetSearchResults();
  getYugiohDataFuzzy(deckData.previousSearch);

}

function viewingDeck(event) {
  $singleView.className = 'container single-view hidden';
  $deckContainer.className = 'container deck-view';
  $searchResultFeed.className = 'row search-results hidden';
  $mobileSearch.className = 'hidden';
  if (deckData.price) {
    $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;
  }
  resetSearchResults();
}

function storeingCurrentData(event) {
  var tempObject = {
    cardName: '',
    entryID: 0,
    imgUrl: '',
    priceObject: {
      amazon_price: parseFloat($singleAmazon.textContent.substring(1)),
      cardmarket_price: parseFloat($singleCardMarket.textContent.substring(1)),
      ebay_price: parseFloat($singleEbay.textContent.substring(1)),
      coolstuffinc_price: parseFloat($singleCoolstuff.textContent.substring(1)),
      tcgplayer_price: parseFloat($singleTCG.textContent.substring(1))
    },
    price: Math.pow(10, 1000)
  };

  for (var items in tempObject.priceObject) {
    if (tempObject.priceObject[items] > 0 && tempObject.priceObject[items] < tempObject.price) {
      tempObject.price = tempObject.priceObject[items];
    }
  }

  tempObject.cardName = $singleCardName.textContent;
  tempObject.entryID = deckData.nextEntryID;
  tempObject.imgUrl = $singleCardImage.src;
  deckData.nextEntryID++;
  deckData.cards.push(tempObject);

  deckData.price += tempObject.price;
  $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;

  $singleView.className = 'hidden';
  $mobileSearch.className = 'column-one-third search-bar-background mobile-search-hidden';
  $searchResultFeed.className = 'row search-results';
  resetSearchResults();
  getYugiohDataFuzzy(deckData.previousSearch);
  appendingCardImageToDeck($singleCardName.textContent);
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
  $deckContainer.className = 'container deck-view hidden';
  $searchResultFeed.className = 'row search-results';
  resetSearchResults();
  $mobileSearch.reset();
}

function windowSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($windowSearch.elements.search.value);
  deckData.previousSearch = $windowSearch.elements.search.value;
  $deckContainer.className = 'container deck-view hidden';
  $searchResultFeed.className = 'row search-results';
  resetSearchResults();
  $windowSearch.reset();
}

// No paramenter functions
function appendingCardImageToDeckURL() {
  var imgElement;
  for (var i = 0; i < deckData.cards.length; i++) {
    imgElement = generateDomTree('div', { class: 'deck-card-image-holder' }, [
      generateDomTree('img', { name: deckData.cards[i].cardName, src: deckData.cards[i].imgUrl })
    ]);
    $deckList.appendChild(imgElement);
    imgElement = null;
  }
}

function resetSearchResults() {
  while ($searchResultFeed.firstChild) {
    $searchResultFeed.removeChild($searchResultFeed.firstChild);
  }
}

function resetDeckResults() {
  while ($deckList.firstChild) {
    $deckList.removeChild($deckList.firstChild);
  }
}

function generateNoResultSearchCard() {
  var DOMTree = generateDomTree('div', { class: 'column-half' }, [
    generateDomTree('div', { class: 'search-card' }, [
      generateDomTree('div', { class: 'image-holder' }, [
        generateDomTree('img', { class: 'card-image', src: 'images/Sheep.png' })
      ]),
      generateDomTree('div', { class: 'search-card-text' }, [
        generateDomTree('h3', { textContent: 'No results found' })
      ])
    ])
  ]);
  $searchResultFeed.appendChild(DOMTree);
}

// Other functions
function appendingCardImageToDeck(cardName) {
  var tempData;
  var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + cardName);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    tempData = xhr.response;
    var imgElement = generateDomTree('div', { class: 'deck-card-image-holder' }, [
      generateDomTree('img', { name: tempData.data[0].name, src: tempData.data[0].card_images[0].image_url })
    ]);
    $deckList.appendChild(imgElement);
  });
  xhr.send();
}

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
      generateDomTree('div', { class: 'search-card-image-holder' }, [
        generateDomTree('img', { class: 'card-image', src: cardData.data[i].card_images[0].image_url })
      ]),
      generateDomTree('div', { class: 'search-card-text' }, [
        generateDomTree('h3', { textContent: cardData.data[i].name }),
        generateDomTree('p', { textContent: truncateTexts(cardData.data[i].desc) })
      ])
    ])
  ]);
  return DOMTree;
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
