/* src/models/album.js */

/* In this file we define the structure of
what we can call a class, or a model. */
module.exports = (connection, DataTypes) => {
/* Here, the schema of the model is defined.
It corresponds to the different columns you will need in your MySQL table.
We usually call those attributes, or properties (meanwhile on the database
side we call the equivalent columns). */

/* So, the Album (without an s, by convention) model (or class)
has two attributes (or properties): name and year.
And the albums (with an s, by convention) table has two columns: name and year.
The role of Sequelize, the ORM, is to handle the link between the model
properties and the table columns, to make it fluid.
Then we can use yourAlbumVariable.name and the library
will know we are actually talking about the name stored in the database. */

  const schema = {
    name: DataTypes.STRING,
    year: DataTypes.INTEGER,
  };
/* Below we add this new model to the connection specified in parameter.
It is very abstract, but we need to do the same for every model we add. */

/* It is also possible to just write it in one line:
    return connection.define('Artist', schema);
*/
  const AlbumModel = connection.define('Album', schema);
  return AlbumModel;
};
