const mongoose = require('mongoose');
   
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Story: {type: String, required: true},
    Genre: {Genre: String,
        Description: String},
    Directors: {Director: String,
        Bio: String},
    Cast: [String],
        ImgURL: String,
        Featured: Boolean,
    GenreID: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Genre'}]
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    DoB: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Movie'}],
    WatchedMovies: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Movie'}],
    WatchList: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;