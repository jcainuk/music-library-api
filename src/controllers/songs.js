const { Album, Artist, Song } = require('../models');

exports.create = (req, res) => {
  const { albumId } = req.params;
/*
get the artist id from req.body 
and artist.findbypk and in the end use both song.setalbum()
and song.setartist()

*/
  Album.findByPk(albumId).then((album) => {
    if (!album) {
      res.status(404).json({ error: "The album could not be found." });
    } else {
      Song.create({
        name: req.body.name,
      }).then((song) => {
        song.setAlbum(album).then((song) => {
          res.status(201).json(song);
        });
      });
    }
  });
};
