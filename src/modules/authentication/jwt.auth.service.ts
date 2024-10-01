import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import {  scrypt as _scrypt } from 'crypto';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { TOKENS } from 'src/utils/app.enums';
import { JwtConfigService } from './jwt.config.service';
import { comparePassword, hashPassword } from 'src/utils';



@Injectable()
export class JwtAuthService {

  constructor(private jwtService: JwtService,
    private userService: UsersService,

    private readonly jwtConfigService: JwtConfigService) { }


    async login(email: string, password: string) {

      const user  = await this.validateUser(email, password);
  
      if(!user) throw new BadRequestException("Email or password is incorrect!");
      
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);
  
      return {
        access_token: accessToken,
        refresh_token : refreshToken
      };
    }

  


  async signup(email: string, password: string){



    const pwdHash = await hashPassword(password);

    const user = await  this.userService.create({email, password: pwdHash }) ;

 
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token : refreshToken
    };
  }



  



  // validate user
  async validateUser(email : string, password: string) : Promise<UserDto>{

    const  [user] = await this.userService.find({email});

    if(!user) return null;
    if(!user.password || !password ) return null
    const checkPwd = await comparePassword(user.password, password);

    if(!checkPwd) return null;
    return user;

  }


  async verifyAsyncToken(token: string) {

    return await this.jwtService.verifyAsync(token);
  }

  verifyToken(token: string) {

    return this.jwtService.verify(token, {
      algorithms: [TOKENS.ENCRYPT_ALGORITHMS],
      secret: this.jwtConfigService.createJwtOptions().secret
    });
  }

  async isValidUserByEmail(email: string) {
    return this.userService.findOneWithCondition({email});
  }
  




  async generateAccessToken(user: UserDto) {
    const payload = { sub: user.email, version: user.version };
    // console.log(payload);

    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(user: UserDto) {
    const payload = { sub: user.email, version: user.version };
    return this.jwtService.sign(payload, { expiresIn: TOKENS.REFRESH_TOKEN_DURATION });
  }
}
