export enum ItemConditionEnum {
  New = 'new',
  Refurbished = 'refurbished',
  Used = 'used',
}

export enum AutoTradeStatusEnum {
  Ongoing = 'ongoing',
  Completed = 'completed',
  UserPending = 'userPending',
  Aborted = 'aborted',
}

export enum BarterStatusEnum {
  Ongoing = 'ongoing',
  Completed = 'completed',
  Rejected = 'rejected',
}

export enum MeetupStatusEnum {
  Scheduled = 'scheduled',
  Ongoing = 'ongoing',
  Cancelled = 'cancelled',
  Success = 'success',
}

export enum RatingEnum {
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
}

export enum ReviewSideEnum {
  Initiator = 'initiator',
  Receiver = 'receiver',
}

export enum ClientStatusEnum {
  Ongoing = 'ongoing',
  OnHold = 'onHold',
  Cancelled = 'cancelled',
}

export enum MessageStatusEnum {
  Sent = 'sent',
  Read = 'read',
  Received = 'received',
}

export enum TargetUserTypeEnum {
  Broker = 'broker',
  Barterer = 'barterer',
}

export enum DisputeStatusEnum {
  Active = 'active',
  Unresolved = 'unresolved',
  Resolved = 'resolved',
}

export enum FlagTypeEnum {
  User = 'user',
  Barter = 'barter',
}

export enum FlagStatusEnum {
  Active = 'active',
  Resolved = 'resolved',
}

export enum UserTypeEnum {
  Barterer = 'barterer',
  Broker = 'broker',
  Admin = 'admin',
}

export enum UserStatusEnum {
  Active = 'active',
  Banned = 'banned',
  Flagged = 'flagged',
}

export enum UserLanguageEnum {
  French = 'french',
  English = 'english',
}

export enum UserThemeEnum {
  Dark = 'dark',
  Light = 'light',
}
export enum ApiResponseStatusEnum {
  Success = 'success',
  Failed = 'failed',
}