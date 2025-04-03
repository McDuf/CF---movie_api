const express = require('express');
const app = express();
const morgan = require('morgan'),
fs = require('fs'),
path = require('path'),
uuid = require('uuid');
const accessLogStream = fs.createWriteStream(path.join(__dirname,'/log.txt'), {flags: 'a'});
const bodyParser = require('body-parser'),
methodOverride = require('method-override');

//static logging
let myLogger = ('/log.txt', (req, res, next) => {
    console.log('Standard Log Entry: ', req.url);
    next(); });

let timeStamp = ('/log.txt', (req, res, next) => {
    req.timeStamp = Date.now();
    next(); });

app.use(myLogger);
app.use(timeStamp);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

let movies = [
    {   title: 'But, I\'m a Cheerleader',
        cast: ['Natasha Lyonne', 'Clea DuVall', 'Melanie Lynskey', 'RuPaul Charles', 'Eddie Cibrian', 'Wesley Mann', 'Richard Moll', 'Douglas Spain', 'Katharine Towne', 'Cathy Moriarty' ],
        year: 1999,
        writer: {name: 'Brian Wayne Peterson'},
        genre: ['Comedy', 'Drama', 'Romance'],
        director: {
            name: 'Jamie Babbit',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'A naive teenager is sent to rehab camp when her straitlaced parents and friends suspect her of being a lesbian.' },
    {   title: 'To Wong Foo', 
        cast: ['Wesley Snipes', 'Patrick Swayze', 'John Leguizamo'],
        year: 1995,
        writer: {name:'Douglas Carter Beane'},
        genre: ['Comedy , Drama'],
        director: {
            name: 'Beeban Kidron',
            birthY: '',
            deathY: '',
            bio: ''        },
        story: 'Three drag queens travel cross-country until their car breaks down, leaving them stranded in a small town.' },
    {   title: 'Fried Green Tomatoes',
        cast: ['Kathy Bates', 'Jessica Tandy', 'Mary Stuart Masterson', 'Mary-Louise Parker', 'Cicely Tyson'],
        year: 1991,
        writer: {name: 'Fannie Flagg'},
        genre: ['Drama'],
        director: {
            name: 'Jon Avnet',
            birthY: '',
            deathY: '',
            bio: ''        },
        story: 'Evelyn, an ordinary housewife, visits a nursing home and befriends the old lady Ninny. Together, they bond over stories from the past about two intrepid women of Whistle Stop Cafe.' },
    {   title: 'The Birdcage',
        cast: ['Robin Williams', 'Nathan Lane', 'Gene Hackman', 'Dianne Wiest', 'Dan Futterman'],
        year: 1996,
        writer: {name: 'Elaine May'},
        genre: ['Comedy'],
        director: {
            name: 'Mike Nichols',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'A gay cabaret owner and his drag queen companion agree to put up a false straight front so that their son can introduce them to his fiancée\'s right-wing, conservative parents.' },
    {   title: 'D.E.B.S.',
        cast: ['Sara Foster', 'Jordana Brewster', 'Meagan Good', 'Jill Ritchie', 'Devon Aoki'],
        year: 2004,
        writer: {name: 'Angela Robinson'},
        genre: ['Action', 'Comedy', 'Romance'],
        director: {
            name: 'Angela Robinson',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'Plaid-skirted schoolgirls are groomed by a secret government agency to become the newest members of the elite national-defense group, D.E.B.S.' },
    {   title: 'Gold Diggers: The Secret of Bear Mountain',
        cast: ['Anna Chlumsky', 'Christina Ricci', 'Polly Draper', 'Brian Kerwin', 'Diana Scarwid', 'David Keith'],
        year: 1995,
        writer: {name: 'Barry Glasser'},
        genre: ['Adventure', 'Drama', 'Family', 'Mystery'],
        director: {
            name: 'Kevin James Dobson',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'A city girl teams up with a tomboy to solve the mystery of Bear Mountain, Molly Morgan, and the buried treasure as well as learn about true friendships.' },
    {   title: 'Boys Don\'t Cry',
        cast: [	'Hilary Swank', 'Chloë Sevigny', 'Peter Sarsgaard', 'Brendan Sexton III', 'Alison Folland', 'Alicia Goranson', 'Matt McGrath', 'Rob Campbell', 'Jeannetta Arnette'],
        year: 1999,
        writer: [{name: 'Kimberly Peirce'}, {name: 'Andy Bienen'}],
        genre: ['Biography', 'Crime', 'Drama', 'Romance'],
        director: {
            name: 'Kimberly Peirce',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'A young transgender man named Brandon navigates love, life, and trying to pass as a boy in rural Nebraska.' },
    {   title: 'In & Out',
        cast: [ 'Kevin Kline', 'Joan Cusack', 'Matt Dillon', 'Debbie Reynolds', 'Wilford Brimley', 'Bob Newhart', 'Tom Selleck'],
        year: 1997,
        writer: {name: 'Paul Rudnick'},
        genre: ['Comedy', 'Romance'],
        director: {
            name: 'Frank Oz',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'A midwestern teacher questions his sexuality after a former student makes a comment about him at the Academy Awards.' },
    {   title: 'Itty Bitty Titty Committee',
        cast: ['Melonie Diaz', 'Nicole Vicius', 'Daniel Sea', 'Guinevere Turner', 'Carly Pope', 'Melanie Mayron'],
        year: 2007,
        writer: [{name:'Tina Mabry'},{name:'Abigail Shafran'}],
        genre: ['Comedy', 'Drama', 'Romance'],
        director: {
            name: 'Jamie Babbit',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'High School grad and all American gal, Anna, finds her purpose and herself after she hooks up with the radical feminists in The Itty Bitty Titty Committee.' },
    {   title: 'Basic Instinct',
        cast: ['Michael Douglas', 'Sharon Stone', 'George Dzundza', 'Jeanne Tripplehorn', 'Wayne Knight'],
        year: 1992,
        writer: { name: 'Joe Eszterhas'},
        genre: ['Drama', 'Mystery', 'Thriller'],
        director: {
            name: 'Paul Verhoeven',
            birthY: '',
            deathY: '',
            bio: ''         },
        story: 'A violent police detective investigates a brutal murder that might involve a manipulative and seductive novelist.' } 
];

let users = [
    {
        userName: 'Admin',
        name: 'McDuf',
        id: 1,
        viewedTitles: ['But, I\'m a Cheerleader', 'D.E.B.S.'],
        watchTitles: ['Basic Instinct'],
        favoriteTitles: ['But, I\'m a Cheerleader', 'D.E.B.S.'] 
    } 
];

//User Options
//Create New User
app.post('/users', (req, res) => { 
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('♫ Say your name ♪ Say your name ♫');
    }
});

//Allow User to Update name
app.put('/users/:id/update/:name', (req, res) => {
    const { name } = req.params;
    const updateName = req.body;

    let user = users.find ( user => user.name == name);

    if (user) {
        user.id = updateName.id;
        res.status(200).json(user);
    } else {
        res.status(400).send('User Does Not Exist');
    }
});

//Allow User to DeRegister
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id; //GET User ID from URL
    const updateUsers = users.filter(users => users.id !== userId);
    if(updateUsers.length === users.length) {
        res.status(404).send('Error, user not removed');
    } else {
        users = updateUsers; //Removes user from Array
        res.status(200).send(`User ${userId} sucessfully removed`);
    }
});

//Allow Users to Add Movies to a List
app.post('/users/:id/favoriteTitles/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteTitles.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${id}'s favorites`);
    } else {
        res.status(400).send("Are you logged in?");
    }
});

app.post('/users/:id/viewedTitles/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.viewedTitles.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to your watched movies`);
    } else {
        res.status(400).send("Are you logged in?");
    }
});

app.post('/users/:id/watchTitles/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.watchTitles.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to your movies to watch`);
    } else {
        res.status(400).send("Are you logged in?");
    }
});

//Allow Users to Remove Movies from a List
app.delete('/users/:id/favoriteTitles/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteTitles = user.favoriteTitles.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${id}'s favorites`);
    } else {
        res.status(400).send("Are you logged in?");
    }
});

app.delete('/users/:id/viewedTitles/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.viewedTitles = user.viewedTitles.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from your viewed movies`);
    } else {
        res.status(400).send("Are you logged in?");
    }
});

app.delete('/users/:id/watchTitles/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.watchTitles = user.watchTitles.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from your watch list`);
    } else {
        res.status(400).send("Are you logged in?");
    }
});

//GET Requests
//Gets the documentation file
app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname}); });

//Gets the list of all movies    
app.get('/movies', (req, res) => {
    res.json(movies); });

//Gets the data about a single movie
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie is not, currently listed \n Would you like to add it?');
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const genreName = req.params.genre;
    const genre = movies
    .map(movie => movie.genre)
    .find(genre => genre.name === genreName);

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('Does not exist, do you?');
    }
});

app.get('/movies/directors/:directorName', (req, res) => {
    const directorName = req.params.director;
    const director = movies
    .map(movie => movie.director)
    .find(director => director.name === directorName);

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('Does not exist, do they direct <mark> friendly </mark> movies?');
    }
});

app.get('/movies/writers/:writerName', (req, res) => {
    const writerName = req.params.writer;
    const writer = movies
    .map(movie => movie.writer)
    .find(writer => writer.name === writerName);

    if (writer) {
        res.status(200).json(writer);
    } else {
        res.status(400).send('Does not exist, do they write <mark>friendly</mark> movies?');
    }
});

//Adds a new movie to list of titles
app.post('/movies', (req, res) => {
    let newMovie = req.body

    if (!newMovie.title) {
        const missingNameMsg = 'Missing Movie Title in Request Body';
        res.status(400).send(missingNameMsg);
    } else {
        movies.push(newMovie);
        res.status(201).send(newMovie);
    }
});

//Default route (homepage)
app.get('/', (req, res) => {
    res.send('Does this answer your question?'); });

//Error Handling
app.get('/log.txt', (req, res) => {
    throw new Error('This is a Test Error, it is only a test');
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh, you done it now');
    console.error(`[${new Date().toISOString()}] Error occurred: `);
    console.error(`Method: ${req.method}, URL: ${req.originalUrl}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`); });

//Listener for Requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
/*
const hostname  = '127.0.0.1';
let port = 8080;
app.listen(port, hostname, () => {
    console.log(`Always Listening.... on port ${PORT}`);
});*/
