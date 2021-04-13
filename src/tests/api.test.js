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

  test('if authorization token is not set fail with 401', async () => {
    const gratitude = { text: 'ty all' };

    await api.post('/api/gratitudes').send(gratitude).expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
