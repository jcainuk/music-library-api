/* src/models/song.js */

/* In this file we define the structure of
what we can call a class, or a model. */
module.exports = (connection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
  };

  const SongModel = connection.define('Song', schema);
  return SongModel;
};
