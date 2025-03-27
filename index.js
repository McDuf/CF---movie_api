const express = require('express');
const app = express();
const morgan = require('morgan'),
fs = require('fs'),
path = require('path');
const accessLogStream = fs.createWriteStream(path.join(__dirname,'/log.txt'), {flags: 'a'});
const bodyParser = require('body-parser'),
methodOverride = require('method-override');

let myTopMovies = [
    {   title: 'But, I\'m a Cheerleader',
        cast: ['Natasha Lyonne', 'Clea DuVall', 'Melanie Lynskey', 'RuPaul Charles', 'Eddie Cibrian', 'Wesley Mann', 'Richard Moll', 'Douglas Spain', 'Katharine Towne', 'Cathy Moriarty' ],
        year: 1999,
        writer: 'Brian Wayne Peterson',
        genre: ['Commedy', 'Drama', 'Romance'],
        director: 'Jamie Babbit',
        story: 'A naive teenager is sent to rehab camp when her straitlaced parents and friends suspect her of being a lesbian.' },
    {   title: 'To Wong Foo', 
        cast: ['Wesley Snipes', 'Patrick Swayze', 'John Leguizamo'],
        year: 1995,
        writer: 'Douglas Carter Beane',
        genre: 'Commedy, Drama',
        director: 'Beeban Kidron',
        story: 'Three drag queens travel cross-country until their car breaks down, leaving them stranded in a small town.' },
    {   title: 'Fried Green Tomatoes',
        cast: ['Kathy Bates', 'Jessica Tandy', 'Mary Stuart Masterson', 'Mary-Louise Parker', 'Cicely Tyson'],
        year: 1991,
        writer: 'Fannie Flagg',
        genre: 'Drama',
        director: 'Jon Avnet',
        story: 'Evelyn, an ordinary housewife, visits a nursing home and befriends the old lady Ninny. Together, they bond over stories from the past about two intrepid women of Whistle Stop Cafe.' },
    {   title: 'The Birdcage',
        cast: ['Robin Williams', 'Nathan Lane', 'Gene Hackman', 'Dianne Wiest', 'Dan Futterman'],
        year: 1996,
        writer: 'Elaine May',
        genre: 'Commedy',
        director: 'Mike Nichols',
        story: 'A gay cabaret owner and his drag queen companion agree to put up a false straight front so that their son can introduce them to his fiancée\'s right-wing, conservative parents.' },
    {   title: 'D.E.B.S.',
        cast: ['Sara Foster', 'Jordana Brewster', 'Meagan Good', 'Jill Ritchie', 'Devon Aoki'],
        year: 2004,
        writer: 'Angela Robinson',
        genre: ['Action', 'Comedy', 'Romance'],
        director: 'Angela Robinson',
        story: 'Plaid-skirted schoolgirls are groomed by a secret government agency to become the newest members of the elite national-defense group, D.E.B.S.' },
    {   title: 'Gold Diggers: The Secret of Bear Mountain',
        cast: ['Anna Chlumsky', 'Christina Ricci', 'Polly Draper', 'Brian Kerwin', 'Diana Scarwid', 'David Keith'],
        year: 1995,
        writer: 'Barry Glasser',
        genre: ['Adventure', 'Drama', 'Family', 'Mystery'],
        director: 'Kevin James Dobson',
        story: 'A city girl teams up with a tomboy to solve the mystery of Bear Mountain, Molly Morgan, and the buried treasure as well as learn about true friendships.' },
    {   title: 'Boys Don\'t Cry',
        cast: [	'Hilary Swank', 'Chloë Sevigny', 'Peter Sarsgaard', 'Brendan Sexton III', 'Alison Folland', 'Alicia Goranson', 'Matt McGrath', 'Rob Campbell', 'Jeannetta Arnette'],
        year: 1999,
        writer: ['Kimberly Peirce', 'Andy Bienen'],
        genre: ['Biography', 'Crime', 'Drama', 'Romance'],
        director: 'Kimberly Peirce',
        story: 'A young transgender man named Brandon navigates love, life, and trying to pass as a boy in rural Nebraska.' },
    {   title: 'In & Out',
        cast: [ 'Kevin Kline', 'Joan Cusack', 'Matt Dillon', 'Debbie Reynolds', 'Wilford Brimley', 'Bob Newhart', 'Tom Selleck'],
        year: 1997,
        writer: 'Paul Rudnick',
        genre: ['Commedy', 'Romance'],
        director: 'Frank Oz',
        story: 'A midwestern teacher questions his sexuality after a former student makes a comment about him at the Academy Awards.' },
    {   title: 'Itty Bitty Titty Committee',
        cast: ['Melonie Diaz', 'Nicole Vicius', 'Daniel Sea', 'Guinevere Turner', 'Carly Pope', 'Melanie Mayron'],
        year: 2007,
        writer: [ 'Tina Mabry', 'Abigail Shafran'],
        genre: ['Comedy', 'Drama', 'Romance'],
        director: 'Jamie Babbit',
        story: 'High School grad and all American gal, Anna, finds her purpose and herself after she hooks up with the radical feminists in The Itty Bitty Titty Committee.' },
    {   title: 'Basic Instinct',
        cast: ['Michael Douglas', 'Sharon Stone', 'George Dzundza', 'Jeanne Tripplehorn', 'Wayne Knight'],
        year: 1992,
        writer: 'Joe Eszterhas',
        genre: ['Drama', 'Mystery', 'Thriller'],
        director: 'Paul Verhoeven',
        story: 'A violent police detective investigates a brutal murder that might involve a manipulative and seductive novelist.' } ];

//static logging
let myLogger = (req, res, next) => {
    console.log(req.url);
    next(); };

let timeStamp = (req, res, next) => {
    req.timeStamp = Date.now();
    next(); };

app.use(myLogger);
app.use(timeStamp);
app.use(express.static('public'));
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

//GET Requests
app.get('/documentation', (req, res, next) => {
    res.sendFile('public/documentation.html', { root: __dirname}); });

app.get('/movies', (req, res, next) => {
    res.json(myTopMovies); });

//Default route (homepage)
app.get('/', (req, res, next) => {
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
const hostname  = '127.0.0.1';
const port = 8080;
app.listen(PORT, hostname, () => {
    console.log(`Always Listening.... on port ${PORT}`);
});
