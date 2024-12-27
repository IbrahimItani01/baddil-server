// 📦 Represents the condition of an item (e.g., in a marketplace)
export enum ItemConditionEnum {
  New = 'new', // 🆕 Item is brand new
  Refurbished = 'refurbished', // 🔄 Item is refurbished
  Used = 'used', // ♻️ Item is used
}

// 🔄 Represents the status of an auto trade process
export enum AutoTradeStatusEnum {
  Ongoing = 'ongoing', // 🔄 Trade process is ongoing
  Completed = 'completed', // ✅ Trade process is completed
  UserPending = 'userPending', // ⏳ User's action is pending
  Aborted = 'aborted', // ❌ Trade was aborted
}

// 🔄 Represents the status of a barter transaction
export enum BarterStatusEnum {
  Ongoing = 'ongoing', // 🔄 Barter process is ongoing
  Completed = 'completed', // ✅ Barter is completed
  Rejected = 'rejected', // ❌ Barter was rejected
}

// 📅 Represents the status of a meetup event (e.g., for a barter or trade)
export enum MeetupStatusEnum {
  Scheduled = 'scheduled', // 🗓️ Meetup is scheduled
  Ongoing = 'ongoing', // 🔄 Meetup is ongoing
  Cancelled = 'cancelled', // ❌ Meetup was cancelled
  Success = 'success', // 🎉 Meetup was successful
}

// ⭐ Represents possible ratings for users or services
export enum RatingEnum {
  One = '1', // ⭐ 1 star rating
  Two = '2', // ⭐⭐ 2 stars rating
  Three = '3', // ⭐⭐⭐ 3 stars rating
  Four = '4', // ⭐⭐⭐⭐ 4 stars rating
  Five = '5', // ⭐⭐⭐⭐⭐ 5 stars rating
}

// 🔄 Represents who initiated the review in a transaction
export enum ReviewSideEnum {
  Initiator = 'initiator', // 💬 The user who initiated the review
  Receiver = 'receiver', // 🎯 The user receiving the review
}

// 🧑‍💼 Represents the status of a client relationship
export enum ClientStatusEnum {
  Ongoing = 'ongoing', // 🔄 Client relationship is ongoing
  OnHold = 'onHold', // ⏸️ Client relationship is on hold
  Cancelled = 'cancelled', // ❌ Client relationship was cancelled
}

// 💬 Represents the status of messages in a communication system
export enum MessageStatusEnum {
  Sent = 'sent', // 📤 Message has been sent
  Read = 'read', // 👀 Message has been read
  Received = 'received', // 📥 Message has been received
}

// 🔑 Represents the type of user for targeted actions (e.g., Barterers or Brokers)
export enum TargetUserTypeEnum {
  Broker = 'broker', // 👔 User is a broker
  Barterer = 'barterer', // 🤝 User is a barterer
}

// 🔧 Represents the status of a dispute resolution process
export enum DisputeStatusEnum {
  Active = 'active', // 🟢 Dispute is active and under review
  Unresolved = 'unresolved', // ⚠️ Dispute is unresolved
  Resolved = 'resolved', // ✅ Dispute has been resolved
}

// 🚩 Represents different types of flags in the system (e.g., for users or barters)
export enum FlagTypeEnum {
  User = 'user', // 🧑‍💼 Flag applies to a user
  Barter = 'barter', // 🔄 Flag applies to a barter transaction
}

// 🛑 Represents the status of flags (e.g., is it resolved or still active)
export enum FlagStatusEnum {
  Active = 'active', // 🟢 Flag is active
  Resolved = 'resolved', // ✅ Flag has been resolved
}

// 👤 Represents different types of users in the system (Barterers, Brokers, Admins)
export enum UserTypeEnum {
  Barterer = 'barterer', // 🤝 User is a barterer
  Broker = 'broker', // 👔 User is a broker
  Admin = 'admin', // ⚙️ User is an admin
}

// ⚠️ Represents the status of users (Active, Banned, Flagged)
export enum UserStatusEnum {
  Active = 'active', // 🟢 User is active
  Banned = 'banned', // 🚫 User is banned
  Flagged = 'flagged', // ⚠️ User is flagged
}

// 🌐 Represents the possible languages for the user interface
export enum UserLanguageEnum {
  French = 'french', // 🇫🇷 User prefers French
  English = 'english', // 🇬🇧 User prefers English
}

// 🌈 Represents the possible themes for the user interface
export enum UserThemeEnum {
  Dark = 'dark', // 🌑 Dark theme
  Light = 'light', // 💡 Light theme
}

// 📊 Represents the status of API responses
export enum ApiResponseStatusEnum {
  Success = 'success', // ✅ API call was successful
  Failed = 'failed', // ❌ API call failed
}
