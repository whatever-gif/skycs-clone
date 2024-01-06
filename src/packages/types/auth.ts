export interface IUser {
  Id: number;
  Email: string;
  Name: string;
  Phone: string | null;
  Language: string;
  TimeZone: number;
  Avatar: string | null;
}
export interface IOrg {
  ParentId: number;
  Id: string;
  Name: string;
  ShortName: string;
  BizType: {
    Id: number;
    Name: string;
  };
  BizField: {
    Id: number;
    Name: string;
  };
  OrgSize: number;
  OrgType: {
    Id: string;
    OrgId: string;
    Name: string;
    Description: string | null;
  };
  ContactName: string;
  Email: string;
  PhoneNo: string | null;
  Description: string | null;
  Enable: boolean;
  UserList: any[] | null;
  InviteList: any[] | null;
  CurrentUserRole: number;
}
export interface ISession {
  CurrentUser: IUser;
  OrgId: string;
  NetworkId: string;
  OrgData: IOrg;
}
export interface Response<T> {
  Success: boolean;
  Data: T;
  ErrorData: null;
  ErrorMessage?: string
}
export interface OrgInfo {
  NetworkId: string;
  OrgId: string;
  OrgData?: IOrg;
}

export interface LocaleData {
  [key: string]: {
    key: string;
    value: string;
  }[];
}
