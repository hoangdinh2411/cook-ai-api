export enum CouponType {
  CODE = 'Code',
  SALE = 'Sale',
  ONLINE_AND_IN_STORE = 'Online & In-Store',
}

export enum REACTION_TYPES {
  LIKE = 'like',
  DISLIKE = 'dislike',
  LOVE = 'love',
  HAHA = 'haha',
}

export enum ROLES {
  USER = 'USER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
}

export enum STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum CouponStatus {
  INACTIVE,
  ONGOING,
  EXPIRED,
}

export enum VerifyCodeType {
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  FORGET_PASSWORD = 'FORGET_PASSWORD',
}

export enum TypeDiscount {
  PERCENT = 'percent',
  DOLLAR = 'dollar',
}
