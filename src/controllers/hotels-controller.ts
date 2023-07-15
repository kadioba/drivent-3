import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
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
    return res.sendStatus(400);
  }
}
