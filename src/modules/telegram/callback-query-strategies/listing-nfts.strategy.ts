
import { CallbackQueryStrategy } from 'src/interface';
import { MintRequestService } from 'src/modules/mint-request/requests.service';
import { NftTypesService } from 'src/modules/nft-types/nft-types.service';
import { NFT_STATUS } from 'src/modules/nfts/nft.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
import TelegramBot from 'node-telegram-bot-api';
import { isAddress } from 'ethers';
import { NftHelperService } from "src/modules/nfts/nft.helper.service";
import { getUserInput } from '../telegram.helper';

export class TelegramListingNftStrategy implements CallbackQueryStrategy {
    constructor(
        private nftTypeService: NftTypesService,

        private nftService: NftsService,
    ) { }

    async handleCallbackQuery(callbackQuery: any, bot: TelegramBot): Promise<void> {

        const chatId = callbackQuery.message.chat.id;

        let tokenInput: string;
      
        try {
          // Acknowledge the callback query to stop the loading spinner
          await bot.answerCallbackQuery(callbackQuery.id);
      
          // Prompt the user to input "tokens"
          await bot.sendMessage(chatId, 'Please input tokens id:');
          
          // Wait for the first input (gens)
          tokenInput = await getUserInput(bot, chatId);
          
          const tokenIds = tokenInput.split(',').map(tokenId => parseInt(tokenId));
          const collection = await this.nftTypeService.findOneWithCondition({ collection_type: 'hero' });
          const nftAddress = collection?.nft_address;
          


          
        } catch (error) {
          console.error('Error handling callback query:', error);
          await bot.sendMessage(chatId, 'An error occurred. Please try again later.');
        }
      }
      
     

      
    
}