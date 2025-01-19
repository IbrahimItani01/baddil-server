import { BadRequestException } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';

interface UpdateBarterData {
  status?: BarterStatus;
  details?: string;
}

export function processBarterUpdate(
  currentStatus: BarterStatus,
  updateData: { status?: string; details?: string },
): UpdateBarterData {
  const { status, details } = updateData;
  const data: UpdateBarterData = {};

  if (
    currentStatus === BarterStatus.completed ||
    currentStatus === BarterStatus.aborted
  ) {
    throw new BadRequestException(
      `Cannot update a barter with status '${currentStatus}'`,
    );
  }

  if (status) {
    if (!Object.values(BarterStatus).includes(status as BarterStatus)) {
      throw new BadRequestException('Invalid barter status');
    }
    data.status = status as BarterStatus;

    if (status === BarterStatus.completed) {
      (data as any).completed_at = new Date();
    }
  }

  if (details) {
    data.details = details;
  }

  return data;
}
