export interface InterfaceToken {
  token_type?: string;
  recieved_at?: number;
  expires_in?: number;
  access_token: string;
  refresh_token?: string;
}
