
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { ActiveGame } from 'src/interface';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';
import { Logger  } from '@nestjs/common';

export class ActiveGameEventStrategy implements EventStrategy {

    private readonly logger = new Logger(ActiveGameEventStrategy.name);

    constructor(
        private nftService: NftsService,
        private readonly axiosHelper: AxiosHelperService


    ) { }

    async handleEvent(event: any): Promise<void> {
        const { user, nftAddress, nftId, feeContract, feeAmount, time } = event.returnValues;
        const blockNumber = Number(event.blockNumber);

        try {
            this.logger.log(`Handle ${user} active game tokenId: ${nftId} at block ${blockNumber}`);
            const result = await this.nftService.updateStateNFT( nftAddress, nftId, blockNumber, { nft_status: NFT_STATUS.ACTIVE_IN_GAME });

            if (result) {
                const nft = await this.nftService.finOneWithCondition({ tokenId: Number(nftId) });

                const data = {
                    "tokenId": Number(nftId),
                    "heroId": nft.attributes.find((attr) => attr.trait_type === 'heroId').value as number,
                    "walletAddress": user,
                    "blockNumber": blockNumber,
                    "action": "active"
                } as ActiveGame;
                const result =   await this.useActiveInGame(data);
                if (result) 
                    await this.nftService.update( {nftAddress, nftId, blockNumber}, { is_in_game: true });
                
                this.logger.log(`${user} call deActive to game with tokenId ${nftId} failed at block ${blockNumber} successfully`);

                console.log(`Active Game Event handled successfully for tokenId: ${nftId}`);

                return;
            }
        } catch (error) {
            this.logger.error(`${user} call active to game with tokenId ${nftId} failed at block ${blockNumber}`, error.response.error);
            console.log(error);
            console.log(`Active Game Event failed for tokenId: ${nftId}`);
            return;

        }
    }
    private async useActiveInGame(data: ActiveGame) {
        try {
            console.info("Active game data", data);
             await  this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
            return true
        } catch (error) {
            console.error('Error active in game:', error);
            return false;
        }
        
    }


}