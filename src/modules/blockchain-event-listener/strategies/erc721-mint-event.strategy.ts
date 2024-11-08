import { Logger } from '@nestjs/common';
import { EventStrategy } from 'src/blockchains/libs/interface';
import { MINT_STATUS, NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';

export class MintEventStrategy implements EventStrategy {
  constructor(private nftService: NftsService) {}

  async handleEvent(event: any): Promise<void> {
    try {
      const { recipient, tokenId, uri } = event.returnValues;
      console.log(`MintEvent handled for tokenId: ${tokenId}`);

      const blockNumber = Number(event.blockNumber);

      const nft = await this.nftService.findOneWithCondition({ uri });

      if (nft.minting_status === MINT_STATUS.MINTED) {
        console.log(`gen already minted  ${uri}`);
        return;
      }
     

      await this.nftService.update(
        { uri },
        {
          minting_status: MINT_STATUS.MINTED,
          nft_status: NFT_STATUS.AVAILABLE,
          tokenId: Number(tokenId),
          owner: recipient,
          block_number: blockNumber,
        },
      );
      Logger.log(`MintEvent handled successfully for tokenId: ${tokenId}`);
    } catch (error) {
      console.log(`MintEvent failed for`);
    
      return;
    }
  }
}
