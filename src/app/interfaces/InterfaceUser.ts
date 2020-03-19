export interface InterfaceUser {
  uuid: string;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string;
  name: string;
  email: string;
  permissions?: string[];
  roles?: string[];
  imgUrl?: string;
}
