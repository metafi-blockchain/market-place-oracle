
import { EventStrategy } from 'src/blockchains/libs/interface';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import { AxiosHelperService } from '../axios-helper.service';
import { GAME_ENDPOINT } from 'src/constants/game.endpoint';
import { ActiveGame } from 'src/interface';

export class DeActiveGameEventStrategy implements EventStrategy {
    constructor(
        private nftService: NftsService,
        private readonly axiosHelper: AxiosHelperService

    ) { }

    async handleEvent(event: any): Promise<void> {
        const { user, nftAddress, nftId, feeContract, feeAmount, time } = event.returnValues;
        const blockNumber = Number(event.blockNumber);

        try {
            const result = await this.nftService.updateStateNFT(user, nftAddress, nftId, blockNumber, {
                nft_status: NFT_STATUS.AVAILABLE
            });
            if (result) {
                const nft = await this.nftService.finOneWithCondition({ tokenId: Number(nftId) });
                const data = {
                    "tokenId": Number(nftId),
                    "heroId": nft.attributes.find((attr) => attr.trait_type === 'heroId').value as number,
                    "walletAddress": user,
                    "blockNumber": blockNumber,
                    "action": "deActive"
                } as ActiveGame;
                
                await this.useActiveInGame(data);
                console.log(`DeActive Game Event handled successfully for tokenId: ${nftId}`);
                return;
            }
        } catch (error) {
            console.log(`DeActive Game Event failed for tokenId: ${nftId}`);
            return;

        }
    }

    private async useActiveInGame(data: ActiveGame) {
        try {
            console.info("DeActive game data", data);
            return await this.axiosHelper.post(GAME_ENDPOINT.HERO, data);
        } catch (error) {
            console.error('Error deActive in game:', error);

        }
    }


}
