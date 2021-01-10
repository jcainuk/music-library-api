/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album, Song } = require('../src/models');

describe('/songs', () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Alanis Morissette',
        genre: 'Indie',
      });
      album = await Album.create({
        name: 'Jagged Little Pill',
        year: 1995,
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /albums/:albumID/songs', () => {
    it('creates a new song under an album', (done) => {
      request(app)
        .post(`/albums/${album.id}/songs`)
        .send({
          artist: artist.id,
          name: 'Ironic',
        })
        .then((res) => {
          expect(res.status).to.equal(201);
          const songId = res.body.id;
          expect(res.body.id).to.equal(songId);
          expect(res.body.name).to.equal('Ironic');
          expect(res.body.artistId).to.equal(artist.id);
          expect(res.body.albumId).to.equal(album.id);
          console.log(album.id, res.body);
          done();
        })
        .catch((error) => done(error));
    });
    it('returns a 404 and does not create a song if the album does not exist', (done) => {
      request(app)
        .post('/albums/1234/songs')
        .send({
          album: album.id,
          name: 'Ironic',
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The album could not be found.');

          Song.findAll().then((songs) => {
            expect(songs.length).to.equal(0);
            done();
          });
        })
        .catch((error) => done(error));
    });
  });
  describe("with songs in the database", () => {
    let songs;
    beforeEach((done) => {
      Promise.all([
        Song.create({ name: "Not The Doctor" }),
        Song.create({ name: "Head Over Feet" }),
        Song.create({ name: "Forgiven" }),
      ]).then((documents) => {
        songs = documents;
        done();
      });
    });
    describe("GET /songs", () => {
      it("gets all song records", (done) => {
        request(app)
          .get("/songs")
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("GET /songs/:songId", () => {
      it("gets song record by ID", (done) => {
        const song = songs[0];
        request(app)
          .get(`/songs/${song.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(song.name);
            done();
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the song does not exist", (done) => {
        request(app)
          .get("/songs/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The song could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("PATCH /songs/:id", () => {
      it("updates song name by id", (done) => {
        const song = songs[0];
        request(app)
          .patch(`/songs/${song.id}`)
          .send({ name: "Right Through You" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id, { raw: true }).then((updatedSong) => {
              expect(updatedSong.name).to.equal("Right Through You");
              done();
            });
          })
          .catch((error) => done(error));
      });

      it("returns a 404 if the song does not exist", (done) => {
        request(app)
          .patch("/songs/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The song could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("DELETE /songs/:songId", () => {
      it("deletes song record by id", (done) => {
        const song = songs[0];
        request(app)
          .delete(`/songs/${song.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Album.findByPk(song.id, { raw: true }).then((updatedSong) => {
              expect(updatedSong).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the song does not exist", (done) => {
        request(app)
          .delete("/songs/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The song could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
