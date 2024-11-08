import { Injectable } from '@nestjs/common';
import { OracleConfig } from './oracle-config.entity';
import { BaseService } from '../commons/base.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { decryptPrivateKeyWithARES } from 'src/utils';

@Injectable()
export class OracleConfigsService  extends BaseService<OracleConfig> { 

    constructor(@InjectModel(OracleConfig.name) private oracleModel: Model<OracleConfig>, private readonly configService: ConfigService){
        super(oracleModel)
    };

    async getOperatorKeyHash() : Promise<string | null> {
        try {
            const config = await this.oracleModel.findOne({}).exec()
         
            
            
            if(!config) return null;

            const privateKeyHash =  config.private_key_hash;
            const decryptCode = this.configService.get<string>('DECRIPT_PRIVATE_KEY')
          
            
            if(!decryptCode) return null;

            return decryptPrivateKeyWithARES(privateKeyHash, decryptCode);

        } catch (error) {
            console.log(error);
            return null;    
        }

    }
}
