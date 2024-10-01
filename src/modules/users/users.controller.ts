import { Body, Controller, Get, Param, Post, Put, ClassSerializerInterceptor, UseGuards, Request, BadRequestException, ConflictException, Req, BadGatewayException } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import {  UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AdminGuard } from 'src/guards/admin.auth.guard';
import { SelfUserGuard } from 'src/guards/user.guard';
import { randomBytes } from 'crypto';

import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { User } from './user.entity';


declare global {
  namespace Express {
    interface Request {
      user?: User
      body?: any
    }
  }
}

// @UseInterceptors(CurrentUserInterceptor)   //config one class
// @UseGuards( RolesGuard)
@UseGuards(JwtAuthGuard)
@Serialize(UserDto)
@Controller('user')
export class UsersController {



  constructor(private userService: UsersService, 

    private readonly configService: ConfigService,

    ) { 
    };

  // @UseInterceptors(CurrentUserInterceptor) //config one route



  @Serialize(UserDto) //use default interceptor
  @Get('/me')
  async findUserBuyId(@Req() req: any) {
    return req.user
  }

  



 


  

  

  




  @Get('/profile/:id')
  async getUserProfile(@Param('id') id: string) {

    return this.userService.findById(id)
  }


  @Post('logout')
  async logOut(@Req() req) {

    try {
      await this.userService.logout(req.user);

      return true
      
    } catch (error) {
        console.log(error);
        
    } 
    return false;
  }
}
