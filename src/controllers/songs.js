const { Album, Artist, Song } = require('../models');

exports.create = (req, res) => {
  const { albumId } = req.params;

  Album.findByPk(albumId).then((album) => {
    if (!album) {
      res.status(404).json({ error: "The album could not be found." });
    } else {
      Song.create({
        name: req.body.name,
      }).then((song) => {
        res.status(201).json(song);
      });
    }
  });
};
