import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import { generalConfig } from '../../config';

export default class JWTService {
  getToken(payload: any, options?: SignOptions) {
    return jsonwebtoken.sign(payload, generalConfig.jwtSecret, options);
  }

  decodeToken(token: string): any {
    return jsonwebtoken.decode(token);
  }

  verifyToken(token: string) {
    return jsonwebtoken.verify(token, generalConfig.jwtSecret);
  }
}
