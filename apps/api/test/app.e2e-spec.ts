import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Account API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/login dengan body invalid → 400 BAD_REQUEST (envelope)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'bukan-email', password: '' })
      .expect(400)
      .expect((res) => {
        const body = res.body as Record<string, unknown>;
        expect(body).toMatchObject({
          success: false,
          statusCode: 400,
          code: 'BAD_REQUEST',
        });
        expect(typeof body.message).toBe('string');
      });
  });

  it('GET /auth/profile tanpa token → 401 UNAUTHORIZED (envelope)', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401)
      .expect((res) => {
        expect(res.body).toMatchObject({
          success: false,
          statusCode: 401,
          code: 'UNAUTHORIZED',
        });
      });
  });

  it('GET /accounts tanpa token → 401 UNAUTHORIZED (envelope)', () => {
    return request(app.getHttpServer())
      .get('/accounts')
      .expect(401)
      .expect((res) => {
        expect(res.body).toMatchObject({
          success: false,
          statusCode: 401,
          code: 'UNAUTHORIZED',
        });
      });
  });
});
