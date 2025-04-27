import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

export class JwtService {
    constructor() {}

    static async signToken(payload: Object, secret: string, expiresIn: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const options: SignOptions = {
                algorithm: 'HS256',
                expiresIn, // in seconds or string like "1h"
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err || !token) {
                    console.error('Error signing token:', err);
                    return reject(err);
                }
                resolve(token);
            });
        });
    }

    static async verifyToken(token: string, secret: string): Promise<JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
                if (err) {
                    console.error('Error verifying token:', err);
                    return reject(err);
                }
                // decoded can be string | JwtPayload, we assume payload is an object
                resolve(decoded as JwtPayload);
            });
        });
    }
}
