// Used for exact name search
// function getYugiohDataExact(exactCardName) {
//   var tempData;
//   var tempDomTree;
//   var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + exactCardName);
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
//   xhr.setRequestHeader('token', 'abc123');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {
//     tempData = xhr.response;
//     tempDomTree = generateSearchCard(tempData);
//     $searchResults.appendChild(tempDomTree);
//   });
//   xhr.send();
// }

// getYugiohDataExact('Blue-Eyes White Dragon');
// getYugiohDataExact('Kuriboh');
