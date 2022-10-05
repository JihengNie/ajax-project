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
var $deckPrice = document.querySelector('.deck-price');
var $loadingAnimation = document.querySelector('.loading');
var $subtractButton = document.querySelector('.subtract-button');
var $modalButton = document.querySelector('.modal-button');
var $modalContainer = document.querySelector('.modal-container');
var $deckNodeList = $deckList.querySelectorAll('.deck-card-image-holder');
var previousDeckData = localStorage.getItem('Deck-Data-local-storage');

var deckData = {
  cards: [],
  previousSearch: 'Kuriboh',
  nextEntryID: 0,
  price: 0.0,
  viewingID: 0
};

if (previousDeckData) {
  deckData = JSON.parse(previousDeckData);
}

// Event Handlers
$mobileSearch.addEventListener('submit', mobileSearching);
$windowSearch.addEventListener('submit', windowSearching);
$searchResultFeed.addEventListener('click', searchDetailedView);
$addButton.addEventListener('click', storeingCardData);
$deckButton.addEventListener('click', viewingDeck);
$headerSearchButton.addEventListener('click', viewingLastSearch);
$deckList.addEventListener('click', deckDetailedView);
window.addEventListener('DOMContentLoaded', deckLoad);
window.addEventListener('beforeunload', storingDeckData);
window.addEventListener('pagehide', storingDeckData);
$subtractButton.addEventListener('click', removingCardFromDeck);
$modalButton.addEventListener('click', hiddingModal);

// Event Hangler functions
function hiddingModal(event) {
  removeAllChildren($searchResultFeed);
  $modalContainer.className = 'hidden';
  getYugiohDataFuzzy('Kuriboh');
}

function removingCardFromDeck(event) {
  for (var i = 0; i < deckData.cards.length; i++) {
    if (deckData.viewingID === deckData.cards[i].entryID.toString()) {
      deckData.price -= deckData.cards[i].price;
      $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;
      deckData.cards.splice(i, 1);
      $deckNodeList = $deckList.querySelectorAll('.deck-card-image-holder');
      for (var j = 0; j < $deckNodeList.length; j++) {
        if ($deckNodeList[i].querySelector('img').getAttribute('entryID') === deckData.viewingID.toString()) {
          $deckNodeList[i].remove();
        }
      }
      deckData.viewingID = null;
      break;
    }
  }
  viewSwapping('deck');
}

function storingDeckData(event) {
  var deckDataStringify = JSON.stringify(deckData);
  localStorage.setItem('Deck-Data-local-storage', deckDataStringify);
}

function deckLoad(event) {
  removeAllChildren($deckList);
  deckData.viewingID = null;
  $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;
  appendingCardImageToDeckURL();
}

function deckDetailedView(event) {
  if (event.target.tagName === 'IMG') {
    getYugiohDataExact(event.target.name);
    viewSwapping('single-deck');
    deckData.viewingID = event.target.getAttribute('entryID');
  }
}

function viewingLastSearch(event) {
  viewSwapping('last-search');
  deckData.viewingID = null;
  removeAllChildren($searchResultFeed);
  getYugiohDataFuzzy(deckData.previousSearch);

}

function viewingDeck(event) {
  viewSwapping('deck');
  deckData.viewingID = null;
  if (deckData.price) {
    $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;
  }
  removeAllChildren($searchResultFeed);
}

function storeingCardData(event) {
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

  var imgElement = generateDomTree('div', { class: 'deck-card-image-holder' }, [
    generateDomTree('img', { name: $singleCardName.textContent, src: $singleCardImage.src, entryID: deckData.nextEntryID })
  ]);
  $deckList.appendChild(imgElement);

  deckData.nextEntryID++;
  deckData.cards.push(tempObject);

  deckData.price += tempObject.price;
  $deckPrice.textContent = 'Value: $' + Math.round(deckData.price * 100) / 100;

  viewSwapping('after-saving');
  removeAllChildren($searchResultFeed);
  getYugiohDataFuzzy(deckData.previousSearch);

}

function searchDetailedView(event) {
  if (event.target.tagName === 'H3') {
    getYugiohDataExact(event.target.textContent);
    viewSwapping('single-search');
  } else if (event.target.parentNode.firstChild.tagName === 'H3') {
    getYugiohDataExact(event.target.parentNode.firstChild.textContent);
    viewSwapping('single-search');
  } else if (event.target.parentNode.parentNode.lastElementChild.firstChild.tagName === 'H3') {
    getYugiohDataExact(event.target.parentNode.parentNode.lastElementChild.firstChild.textContent);
    viewSwapping('single-search');
  }

}

function mobileSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($mobileSearch.elements.search.value);
  deckData.previousSearch = $mobileSearch.elements.search.value;
  viewSwapping('search');
  removeAllChildren($searchResultFeed);
  deckData.viewingID = null;
  $mobileSearch.reset();
}

function windowSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($windowSearch.elements.search.value);
  deckData.previousSearch = $windowSearch.elements.search.value;
  viewSwapping('search');
  removeAllChildren($searchResultFeed);
  deckData.viewingID = null;
  $windowSearch.reset();
}

// No paramenter functions
function appendingCardImageToDeckURL() {
  var imgElement;
  for (var i = 0; i < deckData.cards.length; i++) {
    imgElement = generateDomTree('div', { class: 'deck-card-image-holder' }, [
      generateDomTree('img', { name: deckData.cards[i].cardName, src: deckData.cards[i].imgUrl, entryID: deckData.cards[i].entryID })
    ]);
    $deckList.appendChild(imgElement);
    imgElement = null;
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
function viewSwapping(view) {
  var viewArray = [$singleView, $deckContainer, $subtractButton, $addButton, $searchResultFeed];
  for (var i = 0; i < viewArray.length; i++) {
    viewArray[i].className = 'hidden';
  }
  if (view === 'deck') {
    $deckContainer.className = 'container deck-view';
  } else if (view === 'single-deck') {
    $subtractButton.className = 'subtract-button';
  } else if (view === 'single-search') {
    $addButton.className = 'add-button';
  } else if (view === 'last-search') {
    $searchResultFeed.className = 'row search-results';
  } else if (view === 'after-saving') {
    $searchResultFeed.className = 'row search-results';
  } else if (view === 'search') {
    $searchResultFeed.className = 'row search-results';
  }
}

function loadingDisplay(boolean) {
  if (boolean === true) {
    $loadingAnimation.className = 'row loading';
    $singleView.className = 'container single-view hidden';
  } else {
    $loadingAnimation.className = 'row loading hidden';
  }
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function getYugiohDataExact(exactCardName) {
  var tempData;
  var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + exactCardName);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  loadingDisplay(true);
  xhr.addEventListener('load', function () {
    tempData = xhr.response;
    populatingSingleView(tempData);
    loadingDisplay(false);
    $singleView.className = 'container single-view';
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
  loadingDisplay(true);
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    tempData = xhr.response;
    if (tempData.error) {
      generateNoResultSearchCard();
      return;
    }
    var maxLength = 10; // Can use later to modify how many search results are displayed
    if (maxLength > tempData.data.length) {
      maxLength = tempData.data.length;
    }
    for (var i = 0; i < maxLength; i++) {
      tempDomTree = generateSearchCard(tempData, i);
      $searchResultFeed.appendChild(tempDomTree);
    }
    loadingDisplay(false);
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
