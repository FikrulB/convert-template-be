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
  unique_code: string;
  created_at: Date;
  start_at: Date;
  end_at: Date;
  is_active: boolean;
  user_detail: IUserDetail;
  user_password: IUserPassword[];
  user_role: IUserRole;
}
