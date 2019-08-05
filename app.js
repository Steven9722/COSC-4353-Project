let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
//Mongoose connect and schema -----------------------------------------------
let mongoose = require('mongoose');
mongoose.connect('mongodb+srv://test:test@fuel-price-database-otg6l.mongodb.net/test?retryWrites=true&w=majority');
let userSchema = new mongoose.Schema({
    usernameInput: String,
    passwordInput: String
});
let User = mongoose.model('Users', userSchema);
let profileSchema = new mongoose.Schema({
    username: String, 
    nameInput: String, 
    address1Input: String, 
    address2Input: String, 
    cityInput: String, 
    stateInput: String, 
    zipcodeInput: String,
    numQuotes: Number,
    customer: String
});
let Profile = mongoose.model('Profiles', profileSchema);
let quoteSchema = new mongoose.Schema({
    username: String,
    numGallons: String, 
    deliveryDate: String, 
    addr1: String, 
    addr2: String, 
    suggAmt: String,
    totalCost: String,
    quoteNum: Number,
});
let Quote = mongoose.model('Quotes', quoteSchema);

//Express setup --------------------------------------------------------------
let app = express();
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));
app.use(session({secret: 'totallysecure',saveUninitialized: true,resave: true}));
let sess;

//app.get routes -------------------------------------------------------------
app.get('/', function(req, res) {
    sess = req.session;
    if(sess.username) {
        return res.redirect('profile');
    }
    else {
        res.render('index', {loginSuccess: true, registerSuccess: false});
    }
});

app.get('/profile', function(req, res) {
    sess = req.session;
    if(sess.username) {
        Profile.findOne({ username: sess.username }, function (err, userProfile){
            res.render('profile', {userProfile: userProfile});
        });
    }
    else {
        res.render('redirect');
    }
});

app.get('/quote', function(req, res) {
    sess = req.session;
    if(sess.username) {
        Profile.findOne({ username: sess.username }, function (err, userProfile){
            res.render('quote', {addr1: userProfile.address1Input,
            addr2: userProfile.address2Input});
        });
    }
    else {
        res.render('redirect');
    }
});

app.get('/quotehistory', function(req, res) {
    sess = req.session;
    if(sess.username) {
        Quote.find({ username: sess.username }, function (err, userQuotes){
            res.render('quotehistory', {quotes: userQuotes});
        });
    }
    else {
        res.render('redirect');
    }
});

app.get('/register', function(req, res) {
    sess = req.session;
    res.render('register');
});

app.get('/logout', function(req, res) {
    sess = req.session;
    if(sess.username) {
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            res.redirect('/');
        });
    }
    else {
        res.render('redirect');
    }
});

app.get('/newquote', function(req, res) {
    sess = req.session;
    if(sess.username) {
        res.render('newquote');
    }
    else {
        res.render('redirect');
    }
});


//app.post routes ------------------------------------------------------
app.post('/', urlencodedParser, function (req, res) {
    sess = req.session;
    User.find({usernameInput: req.body.usernameInput, 
                passwordInput: req.body.passwordInput}, function(err, data) {
        if(err) throw err;
        if(data.length) {
            sess.username = req.body.usernameInput;
            Profile.findOne({ username: sess.username }, function (err, userProfile){
                res.render('profile', {userProfile: userProfile});
            });
        }
        else {
            res.render('index', {loginSuccess: false, registerSuccess: false});
        }
    });
});

app.post('/register', urlencodedParser, function (req, res) {
    sess = req.session;
    User.findOne({ usernameInput: req.body.usernameInput }, function (err, userInfo){
        if(userInfo) {
            res.render('registerfail');
        }
        else {
            let newUser = User({usernameInput: req.body.usernameInput, 
                passwordInput: req.body.passwordInput}).save(function(err) {
                if(err) throw err;
            });
            initUserProfile(req.body.usernameInput);
            res.render('index', {loginSuccess: true, registerSuccess: true});
        }
    });
});

app.post('/profile', urlencodedParser, function (req, res) {
    sess = req.session;
    updateProfile(req.body, sess.username);
    Profile.findOne({ username: sess.username }, function (err, userProfile){
        res.render('profile', {userProfile: userProfile});
    });
});

app.post('/quote', urlencodedParser, function (req, res) {
    sess = req.session;
    let quote = req.body;
    Profile.findOne({ username: sess.username }, function (err, userProfile){
        let currentNum = userProfile.numQuotes + 1;
        userProfile.numQuotes = userProfile.numQuotes + 1;
        userProfile.customer = 'true';
        userProfile.save();

        let tempQuote = {username: sess.username, numGallons: quote.gallonsInput, 
            deliveryDate: quote.deliveryDateInput, addr1: quote.deliveryAddr, 
            addr2: quote.deliveryAddr2, suggAmt: quote.suggPrice, 
            totalCost: quote.totalAmt, quoteNum: currentNum};
        let newQuote = Quote({username: sess.username, numGallons: quote.gallonsInput, 
        deliveryDate: quote.deliveryDateInput, addr1: quote.deliveryAddr, 
        addr2: quote.deliveryAddr2, suggAmt: quote.suggPrice, 
        totalCost: quote.totalAmt, quoteNum: currentNum}).save(function(err) {
                if(err) throw err;
        });
        res.render('newquote', {newQuote: tempQuote});
    });
});

app.post('/quotegetprice', urlencodedParser, function (req, res) {
    sess = req.session;
    Profile.findOne({ username: sess.username }, function (err, userProfile){
        let gallons = req.body.gallons;
        let date = req.body.date;
        let currentPrice = 1.5;
        let locationFactor;
        let rateHistoryFactor;
        let gallonsFactor;
        let companyProfitFactor = .10;
        let rateFluctuation;
        let margin;
        let suggPrice;
        let totalAmt;
        let calcPrices;
        if(userProfile.stateInput === 'TX') {
            locationFactor = .02;
        }
        else {
            locationFactor = .04;
        }
    
        if(userProfile.customer === 'true') {
            rateHistoryFactor = .01;
        }
        else {
            rateHistoryFactor = .00;
        }
        
        if(gallons > 1000) {
            gallonsFactor = .02;
        }
        else {
            gallonsFactor = .03;
        }
        
        if(date.substring(5,7) === '06' || date.substring(5,7) === '07' || 
             date.substring(5,7) === '08') {
                rateFluctuation = .04;
        }
        else {
            rateFluctuation = .03;
        }
    
        margin = currentPrice * (locationFactor - rateHistoryFactor + gallonsFactor
                        + companyProfitFactor + rateFluctuation);
        suggPrice = currentPrice + margin;
        suggPrice = Math.round(suggPrice * 100) / 100;
        suggPrice = suggPrice.toFixed(2);
        totalAmt = gallons * suggPrice;
        totalAmt = Math.round(totalAmt * 100) / 100;
        totalAmt = totalAmt.toFixed(2);
        suggPrice = '$' + suggPrice;
        totalAmt = '$' + totalAmt;
        calcPrices = {suggPrice: suggPrice, totalAmt: totalAmt};
        let responseData = calcPrices;
        res.send(responseData);
    });
});

//utility functions ------------------------------------------------------

function initUserProfile(username) {
    let newUserProfile = Profile({username: username, 
        nameInput: '', 
        address1Input: '', 
        address2Input: '', 
        cityInput: '', 
        stateInput: 'AL', 
        zipcodeInput: '',
        numQuotes: 0,
        customer: 'false'}).save(function(err) {
        if(err) throw err;
    });
}


function updateProfile(newProfile, username) {
    Profile.findOne({ username: username }, function (err, userProfile){
        userProfile.nameInput = newProfile.nameInput;
        userProfile.address1Input = newProfile.address1Input;
        userProfile.address2Input = newProfile.address2Input;
        userProfile.cityInput = newProfile.cityInput;
        userProfile.stateInput = newProfile.stateInput;
        userProfile.zipcodeInput = newProfile.zipcodeInput;
        userProfile.save();
    });
}

app.listen(4000);