import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app';
import helper from './testHelper';
import Gratitude from '../models/gratitude';
import User from '../models/user';

const api = supertest(app);

beforeEach(async () => {
  await Gratitude.deleteMany({});

  const gratitudeObjects = helper.gratitudes.map(
    (gratitude) => new Gratitude(gratitude)
  );
  const promiseArray = gratitudeObjects.map((gratitude) => gratitude.save());
  await Promise.all(promiseArray);
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('when there are gratitudes in db', () => {
  test('gratitudes are returned as json', async () => {
    await api
      .get('/api/gratitudes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all gratitudes are returned', async () => {
    const response = await api.get('/api/gratitudes');

    expect(response.body).toHaveLength(helper.gratitudes.length);
  });

  test('gratitude has id and text property', async () => {
    const response = await api.get('/api/gratitudes');
    const gratitude = response.body[0];

    expect(gratitude.id).toBeDefined();
    expect(gratitude.text).toBeDefined();
  });
});

describe('adding new gratitude', () => {
  test('valid gratitude is added given valid token is provided', async () => {
    const gratitude = { text: 'ty all' };

    const token = await helper.getValidToken();

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const gratitudes = await helper.gratitudesInDB();
    const texts = gratitudes.map((r) => r.text);

    expect(gratitudes).toHaveLength(helper.gratitudes.length + 1);
    expect(texts).toContain(gratitude.text);
  });

  test('fail if text property is missing', async () => {
    const token = await helper.getValidToken();

    const gratitude = { text: '' };

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude)
      .expect(400);
  });

  test('fail if authorization token is not set', async () => {
    const gratitude = { text: 'ty all' };

    await api.post('/api/gratitudes').send(gratitude).expect(401);
  });
});

describe('updating existing gratitude', () => {
  test('works for user who created it', async () => {
    const token = await helper.getValidToken();
    const gratitude = { text: 'ty all' };

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude);

    const gratitudes = await helper.gratitudesInDB();
    const savedGratitude = gratitudes.find((g) => g.text === gratitude.text);
    const newGratitude = {
      text: 'new text',
      createdAt: savedGratitude.createdAt,
    };

    await api
      .put(`/api/gratitudes/${savedGratitude.id}`)
      .set('Authorization', token)
      .send(newGratitude)
      .expect(201);

    const newGratitudes = await helper.gratitudesInDB();
    const texts = newGratitudes.map((r) => r.text);

    expect(texts).toContain(newGratitude.text);
    expect(savedGratitude.updatedAt).not.toBe(savedGratitude.createdAt);
  });

  // eslint-disable-next-line
  test("fails for user who didn't create it", async () => {
    const token = await helper.getValidToken();
    const wrongToken = await helper.getValidToken('wronguser', 'password123');
    const gratitude = { text: 'ty all' };

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude);

    const gratitudes = await helper.gratitudesInDB();
    const savedGratitude = gratitudes.find((g) => g.text === gratitude.text);
    const newGratitude = {
      text: 'new text',
      createdAt: savedGratitude.createdAt,
    };

    await api
      .put(`/api/gratitudes/${savedGratitude.id}`)
      .set('Authorization', wrongToken)
      .send(newGratitude)
      .expect(401);
  });

  test('fails if text property is missing with request', async () => {
    const token = await helper.getValidToken();
    const gratitude = { text: 'ty all' };

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude);

    const gratitudes = await helper.gratitudesInDB();
    const savedGratitude = gratitudes.find((g) => g.text === gratitude.text);
    const newGratitude = { createdAt: savedGratitude.createdAt };

    await api
      .put(`/api/gratitudes/${savedGratitude.id}`)
      .set('Authorization', token)
      .send(newGratitude)
      .expect(400);
  });

  test('fail if token is missing with request', async () => {
    const gratitudes = await helper.gratitudesInDB();
    const gratitude = gratitudes[0];

    const newGratitude = {
      text: 'new text',
      createdAt: gratitude.createdAt,
    };

    await api
      .put(`/api/gratitudes/${gratitude.id}`)
      .send(newGratitude)
      .expect(401);
  });
});

describe('deleting existing gratitude', () => {
  test('works for user who created it', async () => {
    const token = await helper.getValidToken();
    const gratitude = { text: 'ty all' };

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude);

    const gratitudes = await helper.gratitudesInDB();
    const savedGratitude = gratitudes.find((g) => g.text === gratitude.text);

    await api
      .delete(`/api/gratitudes/${savedGratitude.id}`)
      .set('Authorization', token)
      .expect(204);

    const newGratitudes = await helper.gratitudesInDB();
    const texts = newGratitudes.map((r) => r.text);

    expect(texts).not.toContain(savedGratitude.text);
  });

  // eslint-disable-next-line
  test("fails for user who didn't create it", async () => {
    const token = await helper.getValidToken();
    const wrongToken = await helper.getValidToken('wronguser', 'password123');
    const gratitude = { text: 'ty all' };

    await api
      .post('/api/gratitudes')
      .set('Authorization', token)
      .send(gratitude);

    const gratitudes = await helper.gratitudesInDB();
    const savedGratitude = gratitudes.find((g) => g.text === gratitude.text);

    await api
      .delete(`/api/gratitudes/${savedGratitude.id}`)
      .set('Authorization', wrongToken)
      .expect(401);
  });

  test('fail if token is missing with request', async () => {
    const gratitudes = await helper.gratitudesInDB();
    const gratitude = gratitudes[0];

    await api.put(`/api/gratitudes/${gratitude.id}`).expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
