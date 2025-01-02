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

  // Prevent updating if the current status is "completed" or "aborted"
  if (currentStatus === BarterStatus.completed || currentStatus === BarterStatus.aborted) {
    throw new BadRequestException(
      `Cannot update a barter with status '${currentStatus}'`,
    );
  }

  // Validate and process the status update
  if (status) {
    if (!Object.values(BarterStatus).includes(status as BarterStatus)) {
      throw new BadRequestException('Invalid barter status');
    }
    data.status = status as BarterStatus;

    // Set completed_at if the status is being set to "completed"
    if (status === BarterStatus.completed) {
      (data as any).completed_at = new Date(); // Add completed_at field dynamically
    }
  }

  // Process additional details
  if (details) {
    data.details = details;
  }

  return data;
}
