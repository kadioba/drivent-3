import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelDataWithRooms, getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelDataWithRooms);

export { hotelsRouter };
