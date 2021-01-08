const { Album, Artist } = require('../models');

exports.create = (req, res) => {
  const { artistId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.create({
        name: req.body.name,
        year: req.body.year,
      }).then((album) => {
        album.setArtist(artist).then((album) => {
          res.status(201).json(album);
        });
      });
    }
  });
};

exports.list = (req, res) => {
  Album.findAll().then((albums) => res.status(200).json(albums));
};

exports.getAlbumById = (req, res) => {
  const { id } = req.params;
  Album.findByPk(id).then((album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(album);
    }
  });
};

exports.updateAlbum = (req, res) => {
  const { id } = req.params;
  Album.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};
