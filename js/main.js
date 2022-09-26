var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-hidden');
var windowCurrentSize = window.innerWidth;
var $listOfCardTexts = document.querySelectorAll('.truncate');

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

function getYugiohData(cardName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php' + 'name=' + cardName);
  xhr.responseType = 'json';
  xhr.send();
}

getYugiohData('Kuriboh');
