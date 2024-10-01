import { Injectable } from "@nestjs/common";

import * as speakeasy from 'speakeasy';
import { TOKENS } from "src/utils/app.enums";
// Load the private key




@Injectable()
export class OtpService{
    constructor(){}
  
    generateOtp(secret: string): string {
        const token = speakeasy.totp({
          secret: secret,
          algorithm: TOKENS.HASH_ALGORITHMS,
          digits: 6,
          window: TOKENS.OPT_VERIFY_DURATION, // allow tokens from 3600 seconds back and 3600 seconds forward
        });
        return token;
      }

      validateOtp(secret: string, otp: string): boolean {
        const isValid = speakeasy.totp.verify({
          secret: secret,
          algorithm: TOKENS.HASH_ALGORITHMS,
          token: otp,
          window: 1,
        });
        return isValid;
      }
    
}