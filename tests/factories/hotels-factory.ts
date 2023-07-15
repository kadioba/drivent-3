import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.business(),
    },
  });
}

export async function createHotelRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.address.cityName(),
      capacity: Number(faker.random.numeric()),
      hotelId,
    },
  });
}

export async function deleteHotel(hotelId: number) {
  return prisma.hotel.delete({
    where: {
      id: hotelId,
    },
  });
}
