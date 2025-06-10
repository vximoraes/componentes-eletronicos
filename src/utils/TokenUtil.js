// /src/utils/TokenUtil.js
import jwt from 'jsonwebtoken';

class TokenUtil {
    generateAccessToken(id) {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { id },
                process.env.JWT_SECRET_ACCESS_TOKEN,
                { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m' },
                (err, token) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(token);
                }
            );
        });
    }

    generateRefreshToken(id) {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { id },
                process.env.JWT_SECRET_REFRESH_TOKEN,
                { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d' },
                (err, token) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(token);
                }
            );
        });
    }

    generatePasswordRecoveryToken(id) {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { id },
                process.env.JWT_SECRET_PASSWORD_RECOVERY,
                { expiresIn: process.env.JWT_PASSWORD_RECOVERY_EXPIRATION || '30m' },
                (err, token) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(token);
                }
            );
        });
    }

    decodeAccessToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                process.env.JWT_SECRET_ACCESS_TOKEN,
                (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(decoded.id);
                }
            );
        });
    }

    decodeRefreshToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                process.env.JWT_SECRET_REFRESH_TOKEN,
                (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(decoded.id);
                }
            );
        });
    }

    decodePasswordRecoveryToken(token, key = process.env.JWT_SECRET_PASSWORD_RECOVERY) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                key,
                (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    resolve(decoded.id);
                }
            );
        });
    }

}

export default new TokenUtil();