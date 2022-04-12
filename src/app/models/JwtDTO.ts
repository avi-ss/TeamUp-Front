export interface JwtDTO {
  token: string;
  type: string;
  nickname: string;
  authorities: string[];
}
