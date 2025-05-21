const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/cfDB');

const Models = require('./js/models.js');
const Movies = Models.Movie;
const Users = Models.User;

const accessLogStream = fs.createWriteStream(path.join(__dirname,'/log.txt'),{flags: 'a'});
app.use(myLogger);
app.use(timeStamp);

app.use(express.static('public'));
app.use(morgan('combined', {stream: accessLogStream}));

//static logging
let myLogger = ('/log.txt', (req, res, next) => {
    console.log('Standard Log Entry: ', req.url);
    next(); });

let timeStamp = ('/log.txt', (req, res, next) => {
    req.timeStamp = Date.now();
    next(); });

//Default route (homepage)
app.get('/', (req, res) => {
    res.send(`Welcome to my DB`); });

//User Options
//Create New User
app.post('/users', async (req, res) => { 
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) =>{ res.status(201).json(user);
                    user.id = uuid.v4();
                    users.push(user)
                 })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => { 
    console.error(error); 
    res.status(500).send('Error: ' + error);
 });
});

//Allow User to Update name
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username},
     { $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
     } 
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
     });
});

//Allow User to DeRegister
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
    if(!user) {
        res.status(404).send(req.params.Username + 'was not found');
    } else {
        res.status(200).send(req.params.Username + ` sucessfully removed`);
    }
})
.catch((error) => { 
    console.error(error);
     res.status(500).send('Error: ' + error);
    });
});

//Allow Users to Add Movies to a List
app.post('/users/:Username/favoriteTitles/:MovieID', async (req, res) => {
   await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { favoriteTitles: req.params.MovieID}
   },
{new: true})
.then ((updatedUser) => {
    res.json(updatedUser);
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });
});

app.post('/users/:Username/viewedTitles/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { viewedTitles: req.params.MovieID}
    },
 {new: true})
 .then ((updatedUser) => {
     res.json(updatedUser);
 })
 .catch((error) => {
     console.error(error);
     res.status(500).send('Error: ' + error);
     });
 });

 app.post('/users/:Username/watchTitles/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { watchTitles: req.params.MovieID}
    },
 {new: true})
 .then ((updatedUser) => {
     res.json(updatedUser);
 })
 .catch((error) => {
     console.error(error);
     res.status(500).send('Error: ' + error);
     });
 });

//Allow Users to Remove Movies from a List
app.delete('/users/:Username/favoriteTitles/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { favoriteTitles: req.params.MovieID}
    },
 {new: true})
 .then ((updatedUser) => {
     res.json(updatedUser);
 })
 .catch((error) => {
     console.error(error);
     res.status(500).send('Error: ' + error);
     });
 });
 
 app.delete('/users/:Username/viewedTitles/:MovieID', async (req, res) => {
     await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { viewedTitles: req.params.MovieID}
     },
  {new: true})
  .then ((updatedUser) => {
      res.json(updatedUser);
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
      });
  });
 
  app.delete('/users/:Username/watchTitles/:MovieID', async (req, res) => {
     await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { watchTitles: req.params.MovieID}
     },
  {new: true})
  .then ((updatedUser) => {
      res.json(updatedUser);
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
      });
  });

//GET Requests

//Gets the documentation file
app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname}); });

//Gets the list of all movies    
app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});
   
//Gets the data about a single movie
app.get('/movies/:movieTitle', async (req, res) => {
    await Movies.findOne({ movieTitle: req.params.movieTitle})
    .then((movies) => {
    if (movies) {
        res.status(201).json(movies);
    } else {
        res.status(400).send('Movie is not, currently listed \n Would you like to add it?');
    }
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });
});
///////////
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
app.listen(3000, () => {
    console.log('Your app is listening on port 3000.');
});
