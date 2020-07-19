export interface InterfaceUser {
  uuid: string;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string;
  name: string;
  email: string;
  emails: {[uuid: string]: string};
  permissions?: { [uuid: string]: string };
  roles?: { [uuid: string]: string };
  imgUrl?: string;
}
