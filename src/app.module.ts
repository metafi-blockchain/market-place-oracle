import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { JWTAuthModule } from './modules/authentication/jwt.auth.module';
import { ActivityLogsModule } from './modules/activitylogs/activity-logs.module';
import {ConfigModule , ConfigService} from '@nestjs/config'
import { S3Module } from './modules/s3/s3.module';

import { APP_PIPE } from '@nestjs/core';
// import { SqsConsumerModule } from './modules/sqs-consumer/sqs-consumer.module';
// import { SqsManagerEventModule } from './modules/sqs-manager-event/sqs-event.module';
import { CustomMiddleware } from './custom.middleware';
import { NftsModule } from './modules/nfts/nfts.module';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { RequestModule } from './modules/mint-request/requests.module';
import { BlockchainEventListenerModule } from './modules/blockchain-event-listener/blockchain-event-listener.module';
import { NftTypesModule } from './modules/nft-types/nft-types.module';
import { OracleConfigsModule } from './modules/configs/oracle-configs.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionHistoryModule } from './modules/event-log-history/event-history.module';
import { Web3Module } from './modules/web3/web3.module';
import { ScannerErrorsModule } from './modules/scanner-errors/scanner-errors.module';
import { DepositRequestModule } from './modules/deposit-request/deposit-request.module';



// const pathENV = process.env.NODE_ENV === 'production'?'.env':`.env.${process.env.NODE_ENV}`

@Module({
  imports:[
      ConfigModule .forRoot({
          isGlobal: true,
          envFilePath: ".env"
      }),
      ScheduleModule.forRoot(),
      UsersModule,
      JWTAuthModule,
      MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: ((config: ConfigService) =>{
            return { uri:  config.get('MONGO_URI_CONNECT_STRING')}
          })
      }),
      ActivityLogsModule,
      S3Module,
      NftsModule,
      CronjobsModule,
      RequestModule,
      BlockchainEventListenerModule,
      NftTypesModule,
      OracleConfigsModule,
      TelegramModule,
      TransactionHistoryModule,
      Web3Module,
      ScannerErrorsModule,
      DepositRequestModule,
  
    ],
  controllers: [],
  providers:[ ConfigService, {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
          whitelist: true
      })
  }],

})


// export class AppModule {}
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(CustomMiddleware).forRoutes('*');;
    }
}
