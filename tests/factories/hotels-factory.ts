import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.business(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
