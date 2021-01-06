/* tests/artists.test.js */
const { expect } = require('chai');
const request = require('supertest');
const { Artist } = require('../src/models');
const app = require('../src/app');

describe('/artists', () => {
  /* The before part is to define some stuff that will be done once, before all tests. */
  before(async () => {
    try {
      /* Below the command creates new tables according to the schema
    specified in the model Artist. */
      await Artist.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });
  /* The beforeEach part is to define some stuff that will be done before each test.
  (If you have 3 tests, it will be run 3 times, before each of those 3 tests). */
  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists', async () => {
    it('creates a new artist in the database', async () => {
      /* Below sends a HTTP POST request to the route /artists
       with the specified object in the body of the request. */
      const response = await request(app).post('/artists').send({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Tame Impala');

      /* Below findByPk (find by primary key) is to find an artist record
      from our table artists (abstracted from the model Artist)
       with the id corresponding to response.body.id.

      Here, we want to retrieve the record created after calling our POST request
      to make sure its properties (name and genre) correspond with what we have sent.

      In plain SQL, the code would look like (assuming connection variable was defined):
      connection.query('SELECT * FROM artists WHERE id = ?', response.body.id); */
      const insertedArtistRecords = await Artist.findByPk(response.body.id, { raw: true });
      expect(insertedArtistRecords.name).to.equal('Tame Impala');
      expect(insertedArtistRecords.genre).to.equal('Rock');
    });
  });
  describe("with artists in the database", () => {
    let artists;
    beforeEach((done) => {
      Promise.all([
        Artist.create({ name: "Tame Impala", genre: "Rock" }),
        Artist.create({ name: "Kylie Minogue", genre: "Pop" }),
        Artist.create({ name: "Dave Brubeck", genre: "Jazz" }),
      ]).then((documents) => {
        artists = documents;
        done();
      });
    });
    describe("GET /artists", () => {
      it("gets all artist records", (done) => {
        request(app)
          .get("/artists")
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((artist) => {
              const expected = artists.find((a) => a.id === artist.id);
              expect(artist.name).to.equal(expected.name);
              expect(artist.genre).to.equal(expected.genre);
            });
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("GET /artists/:artistId", () => {
      it("gets artist record by ID", (done) => {
        const artist = artists[0];
        request(app)
          .get(`/artists/${artist.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(artist.name);
            expect(res.body.genre).to.equal(artist.genre);
            done();
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the artist does not exist", (done) => {
        request(app)
          .get("/artists/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The artist could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("PATCH /artists/:id", () => {
      it("updates artist genre by id", (done) => {
        const artist = artists[0];
        request(app)
          .patch(`/artists/${artist.id}`)
          .send({ genre: "Psychedelic Rock" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
              expect(updatedArtist.genre).to.equal("Psychedelic Rock");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("updates artist name by id", (done) => {
        const artist = artists[0];
        request(app)
          .patch(`/artists/${artist.id}`)
          .send({ name: "Kylie Minogue" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
              expect(updatedArtist.name).to.equal("Kylie Minogue");
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the artist does not exist", (done) => {
        request(app)
          .patch("/artists/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The artist could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
    describe("DELETE /artists/:artistId", () => {
      it("deletes artist record by id", (done) => {
        const artist = artists[0];
        request(app)
          .delete(`/artists/${artist.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
              expect(updatedArtist).to.equal(null);
              done();
            });
          })
          .catch((error) => done(error));
      });
      it("returns a 404 if the artist does not exist", (done) => {
        request(app)
          .delete("/artists/12345")
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal("The artist could not be found.");
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
