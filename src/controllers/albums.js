const { Album, Artist } = require('../models');

exports.create = (req, res) => {
  Album.create(req.body).then((album) => res.status(201).json(album));
};
