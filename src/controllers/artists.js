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
  Artist.create(req.body).then(artist => res.status(201).json(artist));
};
