var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-bar');
var $searchResultFeed = document.querySelector('.search-results');

// Event Handlers
$mobileSearch.addEventListener('submit', mobileSearching);
$windowSearch.addEventListener('submit', windowSearching);

// Event Hangler functions
function mobileSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($mobileSearch.elements.search.value);
  resetSearchResults();
  $mobileSearch.reset();
}

function windowSearching(event) {
  event.preventDefault();
  getYugiohDataFuzzy($windowSearch.elements.search.value);
  resetSearchResults();
  $windowSearch.reset();
}

// Other functions
function resetSearchResults() {
  while ($searchResultFeed.firstChild) {
    $searchResultFeed.removeChild($searchResultFeed.firstChild);
  }
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
