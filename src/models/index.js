/* In this file there is the set up of all models.
 If there are several models
 they all need to be set up here as well. */

const Sequelize = require('sequelize');

/* Here we retrieve our Artist model definition that we will need later on. */
const ArtistModel = require('./artist');
const AlbumModel = require('./album');
const SongModel = require('./song');

/* Below again, we retrieve our environment variables from the .env file.
This works because in our package.json, we have this line:
"start": "nodemon -r dotenv/config index.js"
That makes the link between the library and our .env file. */
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

/* Below, we create a new connection towards our MySQL server and database.
It is not a simple MySQL connection, but it's a Sequelize connection this time.
Sequelize acts a bit as a middleware, that will add an abstraction layer on top of the database. */
const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  const Artist = ArtistModel(connection, Sequelize);
  const Album = AlbumModel(connection, Sequelize);
  const Song = SongModel(connection, Sequelize);
  /* belongsTo creates a getter and setter for the album instances
   and deals with the database setup for the foreign key inside the albums table */
  Album.belongsTo(Artist, { as: 'artist' });
  Song.belongsTo(Artist, { as: 'artist' });
  Song.belongsTo(Album, { as: 'album' });

  /* Below this checks what is the current state
  of the table in the database (which columns it has, what are
  their data types, etc), and then performs the necessary changes
  in the table to make it match the model.
  Basically it will create the table if it does not exist yet, or update the columns if needed. */
  connection.sync({ alter: true });
  return {
    Artist,
    Album,
    Song,
  };
};

module.exports = setupDatabase();
