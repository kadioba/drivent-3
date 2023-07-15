import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createCustomTicketType, createEnrollmentWithAddress, createTicket, createUser } from '../factories';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 404 when there is no enrollment for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 when there is no hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response).toBe(httpStatus.NOT_FOUND);
    });
    describe('when ticket is valid', () => {
      it('should respond with status 402 when ticket is reserved', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response).toBe(httpStatus.PAYMENT_REQUIRED);
      });
      it('should respond with status 402 when ticket type is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicketType(true, false);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response).toBe(httpStatus.PAYMENT_REQUIRED);
      });
      it('should respond with status 402 when ticket doesn`t include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicketType(false, false);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response).toBe(httpStatus.PAYMENT_REQUIRED);
      });
      it('should respond with status 200 and with hotels data', async () => {
        const hotel = await createHotel();
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt,
            updatedAt: hotel.updatedAt,
          },
        ]);
      });
    });
  });
});

describe('GET /hotels/hotelId', () => {
    
});
