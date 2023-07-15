import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (err.name === 'PaymentRequiredError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelDataWithRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  try {
    const hotelWithRooms = await hotelsService.getHotelDataWithRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(hotelWithRooms);
  } catch (err) {
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (err.name === 'PaymentRequiredError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(400);
  }
}
