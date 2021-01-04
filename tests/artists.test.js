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
  });
});
