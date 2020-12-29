/* src/models/artist.js */
module.exports = (connection, DataTypes) => {
    const schema = {
      name: DataTypes.STRING,
      genre: DataTypes.STRING,
    };
  
    const ArtistModel = connection.define('Artist', schema);
    return ArtistModel;
  };