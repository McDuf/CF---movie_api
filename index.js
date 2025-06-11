const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), //import built-in module fs
    path = require('path'); //import builit in module path

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join('C:\Users\"Hannah Irey"\Desktop\CareerFoundry\FullStackImmersion\Achievement_2-ServerSideProgramming_NodeJS\movie_api','./log.txt'),{flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const path = require('path');
app.use('/', express.static(path.join('C:\Users\"Hannah Irey"\Desktop\CareerFoundry\FullStackImmersion\Achievement_2-ServerSideProgramming_NodeJS\movie_api\public','public')));
app.use('/movies', express.static('movies'));
app.use('/users', express.static('users'));

const Models = require('../js/models.js');
const Movies = Models.Movie;
const Users = Models.User;

//static logging
let myLogger = ('/log.txt', (req, res, next) => {
    console.log('Standard Log Entry: ', req.url);
    next(); });

let timeStamp = ('/log.txt', (req, res, next) => {
    req.timeStamp = Date.now();
    next(); });

//Default route (homepage)

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('/documentation.html');
});

app.get('/movies', (req, res) => {
  res.json(Movies);
});

app.get('/users', (req, res) => {
  res.json(Users);
});

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
//1
app.get('/movies/genre/:genreName', async (req, res) => {
    await Genre.findone({ genreName: req.params.genreName})
    .then((genre) => {
        if (genre) {
            res.status(200).json(genre);
    } else {
        res.status(400).send('Does not exist, do you?');
    }
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/directors/:directorName', async (req, res) => {
   await Director.findone({ directorName: req.params.directorName})
   .then((director) => {
    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('Does not exist, do they direct <mark> friendly </mark> movies?');
    }
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/writers/:writerName', async (req, res) => {
    await writer.findone({ writerName: req.params.writerName})
    .then((writer) => {
    if (writer) {
        res.status(200).json(writer);
    } else {
        res.status(400).send('Does not exist, do they write <mark>friendly</mark> movies?');
    }
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });
});

/*//Adds a new movie to list of titles
app.post('/movies', (req, res) => {
    let newMovie = req.body

    if (!newMovie.title) {
        const missingNameMsg = 'Missing Movie Title in Request Body';
        res.status(400).send(missingNameMsg);
    } else {
        movies.push(newMovie);
        res.status(201).send(newMovie);
    }
});/*/

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
