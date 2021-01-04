/* src/controllers/artists.js */
const { Artist } = require('../models');

/* Here we define the controller method like we used to do in the app.js file.
 chaining  function calls.

artistInfo = req.body;

With the help of Sequelize, we create a new Artist record with the create() function.

Assuming that the connection was declared it is equal to saying:

connection.query("INSERT INTO artists VALUES (?, ?)", artistInfo.name, artistInfo.genre);

Then, we go through the .then() if the creation worked.

In .then() , we give back a response to the user, with a status 201
 and with a body containing the data of the artist created
 (because the .then() after the .create() provides us
  with a parameter containing the created record). */

exports.create = (req, res) => {
  Artist.create(req.body).then((artist) => res.status(201).json(artist));
};

exports.list = (req, res) => {
  Artist.findAll().then((artists) => res.status(200).json(artists));
};

exports.getArtistById = (req, res) => {
  const { id } = req.params;
  Artist.findByPk(id).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.updateArtist = (req, res) => {
  const { id } = req.params;
  Artist.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};
