const request = require('supertest');

/** Seed edilen test kullanıcısıyla giriş yapıp JWT token döner. */
async function loginAsTestUser(app) {
  const res = await request(app).post('/api/auth/login').send({
    email: 'test@university.edu',
    password: 'test123',
  });
  return res.body.token;
}

/** Yeni bir kullanıcı kaydedip giriş yapar, JWT token döner. */
async function registerAndLogin(app, { username, email, password }) {
  await request(app).post('/api/auth/register').send({ username, email, password });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

module.exports = { loginAsTestUser, registerAndLogin };
