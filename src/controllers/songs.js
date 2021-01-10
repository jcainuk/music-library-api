const { Album, Artist, Song } = require('../models');

exports.create = (req, res) => {
  const { albumId } = req.params;
  const { artistId } = req.body;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.findByPk(albumId).then((album) => {
        if (!album) {
          res.status(404).json({ error: "The album could not be found." });
        } else {
          Song.create({
            name: req.body.name,
          }).then((song) => {
            song.setArtist(artist).setAlbum(album)
              .then((song) => {
                res.status(201).json(song);
              });
          });
        }
      });
    }
  });
};
