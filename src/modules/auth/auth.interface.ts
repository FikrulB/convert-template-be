export interface IRole {
  code: string;
  name: string;
}

export interface IUserRole {
  role: IRole;
}

export interface IUserPassword {
  password: string;
}

export interface IUserDetail {
  avatar: string;
  fullname: string;
  address: string;
}

export interface IUser {
  email: string;
  id: bigint;
  uniqueCode: string;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  userDetail: IUserDetail;
  userPassword: IUserPassword[];
  userRole: IUserRole;
}
