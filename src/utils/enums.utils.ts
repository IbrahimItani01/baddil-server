export enum ItemCondition {
  New = 'new',
  Refurbished = 'refurbished',
  Used = 'used',
}

export enum AutoTradeStatus {
  Ongoing = 'ongoing',
  Completed = 'completed',
  UserPending = 'userPending',
  Aborted = 'aborted',
}

export enum BarterStatus {
  Ongoing = 'ongoing',
  Completed = 'completed',
  Rejected = 'rejected',
}

export enum MeetupStatus {
  Scheduled = 'scheduled',
  Ongoing = 'ongoing',
  Cancelled = 'cancelled',
  Success = 'success',
}

export enum Rating {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

export enum ReviewSide {
  Initiator = 'initiator',
  Receiver = 'receiver',
}

export enum ClientStatus {
  Ongoing = 'ongoing',
  OnHold = 'onHold',
  Cancelled = 'cancelled',
}

export enum MessageStatus {
  Sent = 'sent',
  Read = 'read',
  Received = 'received',
}

export enum TargetUserType {
  Broker = 'broker',
  Barterer = 'barterer',
}

export enum DisputeStatus {
  Active = 'active',
  Unresolved = 'unresolved',
  Resolved = 'resolved',
}

export enum FlagType {
  User = 'user',
  Barter = 'barter',
}

export enum FlagStatus {
  Active = 'active',
  Resolved = 'resolved',
}

export enum UserType {
  Barterer = 'barterer',
  Broker = 'broker',
  Admin = 'admin',
}

export enum UserStatus {
  Active = 'active',
  Banned = 'banned',
  Flagged = 'flagged',
}

export enum UserLanguage {
  French = 'french',
  English = 'english',
}

export enum UserTheme {
  Dark = 'dark',
  Light = 'light',
}
