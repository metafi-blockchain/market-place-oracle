import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { TOKENS } from 'src/utils/app.enums';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtConfigService implements JwtOptionsFactory {

  constructor(private readonly configService: ConfigService) {}


  createJwtOptions(): JwtModuleOptions {

    const privateKey = fs.readFileSync(this.configService.get<string>('JTW_PRIVATE_PATH_FILE'), 'utf8')  //todo change jwt key
    const publicKey = fs.readFileSync(this.configService.get<string>('JTW_PUBLIC_PATH_FILE'), 'utf8')

    return {
  
      secret: privateKey,
      // privateKey:  privateKey,
      publicKey: publicKey,
      signOptions: { 
        expiresIn: TOKENS.JWT_TOKEN_DURATION , algorithm: TOKENS.ENCRYPT_ALGORITHMS },
      verifyOptions: {
        algorithms:[TOKENS.ENCRYPT_ALGORITHMS]
      }
    };
  }
}
