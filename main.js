


function logIn() {
    alert("Logged in");
}

function registerUser() {
    alert("Registered user")
}

function saveProfile() {
    var fullName = document.getElementById('nameInput').value;
    var address1 = document.getElementById('address1Input').value;
    var address2 = document.getElementById('address2Input').value;
    var cityName = document.getElementById('cityInput').value;
    var stateName = document.getElementById('stateInput').value;
    var zipCode = document.getElementById('zipcodeInput').value;

    var profile = {
        name: fullName,
        addr1: address1,
        addr2: address2,
        city: cityName,
        state: stateName,
        zip: zipCode
    }

    localStorage.setItem('profile', JSON.stringify(profile));
    

    alert(fullName);
}

function quoteAutofil() {
    var profile = JSON.parse(localStorage.getItem('profile'));

    document.getElementById('deliveryAddr').value = profile.addr1;
    document.getElementById('deliveryAddr2').value = profile.addr2;
    document.getElementById('deliveryAddr').readOnly = true;
    document.getElementById('deliveryAddr2').readOnly = true;

    document.getElementById('quoteRequestForm').addEventListener('submit', generateQuote);
}

function generateQuote(e) {
    var numGallons = document.getElementById('gallonsInput').value;
    var deliveryDate = document.getElementById('deliveryDateInput').value;
    var address1 = document.getElementById('deliveryAddr').value;
    var address2 = document.getElementById('deliveryAddr2').value;
    var suggestedPrice = 200; //placeholder
    var rate = 3; //placeholder
    var totalAmount = numGallons * suggestedPrice * rate;

    var newQuote = {
        gallons: numGallons,
        date: deliveryDate,
        addr1: address1,
        addr2: address2,
        suggested: suggestedPrice,
        total: totalAmount
    }

    var newQuoteDiv = document.getElementById('newQuote');
    newQuoteDiv.innerHTML = '';
    
    newQuoteDiv.innerHTML =    '<div class="row">' +
                                '<div class="col">' +
                                '</div>' +
                                '<div class="col">' +
                                '# of Gallons' +
                                '</div>' +
                                '<div class="col">' +
                                'Delivery Date' +
                                '</div>' +
                                '<div class="col">' +
                                'Address 1' +
                                '</div>' +
                                '<div class="col">' +
                                'Address 2' +
                                '</div>' +
                                '<div class="col">' +
                                'Suggested Amount' +
                                '</div>' +
                                '<div class="col">' +
                                'Total Cost' +
                                '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                '<div class="col">' +
                                'Your Quote: ' +
                                '</div>' +
                                '<div class="col">' + 
                                newQuote.gallons +
                                '</div>' +
                                '<div class="col">' +
                                newQuote.date +
                                '</div>' +
                                '<div class="col">' +
                                newQuote.addr1 +
                                '</div>' +
                                '<div class="col">' +
                                newQuote.addr2 +
                                '</div>' +
                                '<div class="col">' +
                                '$' + newQuote.suggested +
                                '</div>' +
                                '<div class="col">' +
                                '$' + newQuote.total +
                                '</div>'
                                '</div>';


    if (localStorage.getItem('quotes') == null) {
        var quotes = [];
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } 
    else {
        var quotes = JSON.parse(localStorage.getItem('quotes'));
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    alert("Quote generated");
    e.preventDefault();
}

function listQuotes() {
    var quotes = JSON.parse(localStorage.getItem('quotes'));
    var newQuoteDiv = document.getElementById('newQuote');

    newQuoteDiv.innerHTML = '<div class="row">' +
                                '<div class="col">' +
                                '</div>' +
                                '<div class="col">' +
                                '# of Gallons' +
                                '</div>' +
                                '<div class="col">' +
                                'Delivery Date' +
                                '</div>' +
                                '<div class="col">' +
                                'Address 1' +
                                '</div>' +
                                '<div class="col">' +
                                'Address 2' +
                                '</div>' +
                                '<div class="col">' +
                                'Suggested Amount' +
                                '</div>' +
                                '<div class="col">' +
                                'Total Cost' +
                                '</div>' +
                                '</div>';
    var count = 1;
    for (var i = 0; i < quotes.length; i++) {
        var gallons = quotes[i].gallons;
        var deliveryDate = quotes[i].date;
        var address1 = quotes[i].addr1;
        var address2 = quotes[i].addr2;
        var suggestedAmt = quotes[i].suggested;
        var totalCost = quotes[i].total;

        newQuoteDiv.innerHTML +=    '<div class="row">' +
                                    '<div class="col">' +
                                    'Quote ' + count +
                                    '</div>' +
                                    '<div class="col">' + 
                                    gallons +
                                    '</div>' +
                                    '<div class="col">' +
                                    deliveryDate +
                                    '</div>' +
                                    '<div class="col">' +
                                    address1 +
                                    '</div>' +
                                    '<div class="col">' +
                                    address2 +
                                    '</div>' +
                                    '<div class="col">' +
                                    '$' + suggestedAmt +
                                    '</div>' +
                                    '<div class="col">' +
                                    '$' + totalCost +
                                    '</div>'
                                    '</div>';
        count++;
    }

    alert("Quotes listed")
}