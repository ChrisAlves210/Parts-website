

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('searchInput');
  var makeInput = document.getElementById('makeInput');
  var modelInput = document.getElementById('modelInput');
  var submodelInput = document.getElementById('submodelInput');
  var tbody = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');
  var webBtn = document.getElementById('webSearchBtn');
  var vendorButtons = document.getElementsByClassName('vendor-btn');
  var sortPriceAscBtn = document.getElementById('sortPriceAscBtn');
  var refreshPricesBtn = document.getElementById('refreshPricesBtn');
  var priceUpdatedAt = document.getElementById('priceUpdatedAt');

  function applyFilters() {
    var q = (input && input.value ? input.value.toLowerCase() : '');
  var mk = (makeInput && makeInput.value ? makeInput.value.toLowerCase() : '');
  var md = (modelInput && modelInput.value ? modelInput.value.toLowerCase() : '');
  var sm = (submodelInput && submodelInput.value ? submodelInput.value.toLowerCase() : '');
    for (var i = 0; i < rows.length; i++) {
      var tds = rows[i].getElementsByTagName('td');
      var name = tds[0] ? tds[0].textContent.toLowerCase() : '';
  var make = tds[1] ? tds[1].textContent.toLowerCase() : '';
  var model = tds[2] ? tds[2].textContent.toLowerCase() : '';
  var submodel = tds[3] ? tds[3].textContent.toLowerCase() : '';
      var match = true;
      if (q && name.indexOf(q) === -1) match = false;
      if (mk && make.indexOf(mk) === -1) match = false;
  if (md && model.indexOf(md) === -1) match = false;
  if (sm && submodel.indexOf(sm) === -1) match = false;
      rows[i].style.display = match ? '' : 'none';
    }
  }

  if (input) input.addEventListener('input', applyFilters);
  if (makeInput) makeInput.addEventListener('input', applyFilters);
  if (modelInput) modelInput.addEventListener('input', applyFilters);
  if (submodelInput) submodelInput.addEventListener('input', applyFilters);

  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) {
        status.textContent = 'Thanks! This form does not actually send.';
      }
      form.reset();
      setTimeout(function () {
        if (status) status.textContent = '';
      }, 3000);
    });
  }

  // Clicking a row fills the search box with that part's name
  for (var r = 0; r < rows.length; r++) {
    rows[r].addEventListener('click', function () {
      var nameCell = this.getElementsByTagName('td')[0];
      if (nameCell && input) {
        input.value = nameCell.textContent;
        applyFilters();
      }
    });
  }

  // (reviews and top-rated logic removed)

  // Web search button opens Google with the typed query
  function fullQuery() {
    var parts = [];
    if (input && input.value) parts.push(input.value);
    if (makeInput && makeInput.value) parts.push(makeInput.value);
  if (modelInput && modelInput.value) parts.push(modelInput.value);
  if (submodelInput && submodelInput.value) parts.push(submodelInput.value);
    return parts.join(' ').trim();
  }

  if (webBtn) {
    webBtn.addEventListener('click', function () {
      var q = fullQuery();
      if (!q) {
        alert('Type a part name first.');
        return;
      }
      var url = 'https://www.google.com/search?q=' + encodeURIComponent(q + ' parts');
      window.open(url, '_blank');
    });
  }

  // Vendor buttons: open specific vendor searches
  function openVendor(vendor, query) {
    var q = (query || '').trim();
    if (!q) {
      alert('Type a part name first.');
      return;
    }
    var url = '';
    if (vendor === 'amazon') {
      url = 'https://www.amazon.com/s?k=' + encodeURIComponent(q);
    } else if (vendor === 'ebay') {
      url = 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(q);
    } else if (vendor === 'rockauto') {
      // RockAuto: use Google site search
      url = 'https://www.google.com/search?q=' + encodeURIComponent('site:rockauto.com ' + q);
    } else if (vendor === 'gshop') {
      url = 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(q);
    } else {
      url = 'https://duckduckgo.com/?q=' + encodeURIComponent(q + ' parts');
    }
    window.open(url, '_blank');
  }

  for (var vb = 0; vb < vendorButtons.length; vb++) {
    vendorButtons[vb].addEventListener('click', function () {
      var vendor = this.getAttribute('data-vendor');
      var q = fullQuery();
      openVendor(vendor, q);
    });
  }

  // Initial filter apply (in case inputs have preset values)
  applyFilters();

  // Helper to parse price like "$12.75" -> 12.75
  function parsePrice(text) {
    var cleaned = (text || '').replace(/[^0-9.]/g, '');
    var val = parseFloat(cleaned);
    return isNaN(val) ? Number.POSITIVE_INFINITY : val;
  }

  // Sort table rows by price ascending; keep header intact
  function sortByPriceAsc() {
    var rowsArr = Array.prototype.slice.call(rows);
    rowsArr.sort(function (a, b) {
      var ta = a.getElementsByTagName('td');
      var tb = b.getElementsByTagName('td');
      var pa = ta[5] ? parsePrice(ta[5].textContent) : Number.POSITIVE_INFINITY; // Price col index 5
      var pb = tb[5] ? parsePrice(tb[5].textContent) : Number.POSITIVE_INFINITY;
      if (pa === pb) {
        var na = ta[0] ? ta[0].textContent : '';
        var nb = tb[0] ? tb[0].textContent : '';
        return na.localeCompare(nb);
      }
      return pa - pb;
    });
    for (var i = 0; i < rowsArr.length; i++) {
      tbody.appendChild(rowsArr[i]);
    }
  }

  if (sortPriceAscBtn) {
    sortPriceAscBtn.addEventListener('click', function () {
      sortByPriceAsc();
      applyFilters();
    });
  }

  // Live price updater: fetch prices.json and update table
  function updatePricesFromData(data) {
    // data format: { "SKU": 12.34, ... }
    var map = data || {};
    for (var i = 0; i < rows.length; i++) {
      var tds = rows[i].getElementsByTagName('td');
      if (tds.length < 7) continue;
      var sku = tds[4].textContent.trim();
      if (map.hasOwnProperty(sku)) {
        var price = parseFloat(map[sku]);
        if (!isNaN(price)) {
          tds[5].textContent = '$' + price.toFixed(2);
        }
      }
    }
    if (priceUpdatedAt) {
      var now = new Date();
      priceUpdatedAt.textContent = 'Updated ' + now.toLocaleTimeString();
    }
  }

  function fetchPrices() {
    // For static hosting, fetch prices.json from the same directory
    fetch('prices.json', { cache: 'no-cache' })
      .then(function (res) { return res.json(); })
      .then(function (json) { updatePricesFromData(json); })
      .catch(function () {
        if (priceUpdatedAt) priceUpdatedAt.textContent = 'Prices could not be loaded';
      });
  }

  if (refreshPricesBtn) {
    refreshPricesBtn.addEventListener('click', fetchPrices);
  }

  // Optionally auto-fetch on load
  fetchPrices();
});
