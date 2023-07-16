import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTickeWithTypeByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === 'RESERVED') throw paymentRequiredError();
  if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
  if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();

  const hotels = await hotelsRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelDataWithRooms(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTickeWithTypeByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === 'RESERVED') throw paymentRequiredError();
  if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
  if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();

  const hotelDataWithRooms = await hotelsRepository.getHotelDataWithRooms(hotelId);
  console.log(hotelDataWithRooms)
  if (hotelDataWithRooms === null) return notFoundError();
  return hotelDataWithRooms;
}

const hotelsService = { getHotels, getHotelDataWithRooms };

export default hotelsService;
