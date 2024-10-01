import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NFT_STATUS } from './nft.entity';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { isAddress } from 'ethers';

@ApiTags('nfts')
@Controller('nfts')
export class NftsController {
    constructor(
        private readonly nftService: NftsService,
    ) {}


    @ApiOperation({ description: 'Get a paginated list of NFTs listing the marketplace' })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination (default: 1)',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page (default: 100)',
        example: 100,
    })
    @Get('/market')
    async getNftListMarket(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            throw new BadRequestException('Page and limit must be valid numbers');
        }

        const skip = (pageNumber - 1) * limitNumber;

        const nfts = await this.nftService.aggregate([
            { $match: { nft_status: NFT_STATUS.LISTING_MARKET } },
            { $project: { _id: 0, nft_type: 0, minting_status: 0 } },
            { $skip: skip },
            { $limit: limitNumber },
        ]);

        const totalItems = await this.nftService.count({ nft_status: NFT_STATUS.LISTING_MARKET });
        const totalPages = Math.ceil(totalItems / limitNumber);

        return {
            currentPage: pageNumber,
            totalPages: totalPages,
            totalItems: totalItems,
            items: nfts,
        };
    }

    @ApiOperation({ description: 'Get detail of an NFT in a collection' })
    @ApiParam({
        name: 'collectionAddress',
        required: true,
        description: 'The address of the NFT collection',
        example: '0x6F7a1FF0711269bd20964168247dB76e5fda9f1f',
    })
    @ApiParam({
        name: 'nftId',
        required: true,
        description: 'The ID of the NFT within the collection',
        example: '152',
    })
    @Get('/detail/:collectionAddress/:nftId')
    async getDetailNft( @Param('collectionAddress') collectionAddress: string, @Param('nftId') nftId: string,) {

        this.validateAddress(collectionAddress);
        
        return this.nftService.findOneWithCondition({ tokenId: Number(nftId), collection_address: collectionAddress });
    }


    @ApiParam({
        name: 'account',
        required: true,
        description: 'The account address of the owner',
        example: '0x6F7a1FF0711269bd20964168247dB76e5fda9f1f',
    })
    @ApiOkResponse({
        description: 'List of NFTs owned by the account',
        content: {
            'application/json': {
                example: [
                    {
                        tokenId: 1,
                        name: 'Rare NFT #1',
                        owner: '0xF3AB27458205344Ce20EdC87Bb747083B6dda67b',
                        nft_status: 'LISTING_MARKET',
                    },
                ],
            },
        },
    })
    @ApiOperation({ description: 'Get nfts of owner', parameters: [{ name: 'account', required: true, in: 'path' }]})
    @Get('/owner/:account')
    async getByOwner( @Param('account') account: string, ) {


        this.validateAddress(account);

        return this.nftService.aggregate([
            {
                $match: {
                    owner: account
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    nft_type: 0, // Exclude the nft_type field
                    minting_status: 0, // Exclude the minting_status field
                },
            },
        ]);
    }

    @ApiOperation({ description: 'Get nfts of collection filter by hero id' })
    @ApiParam({
        name: 'collectionAddress',
        required: true,
        description: 'The address of the NFT collection',
        example: '0x6F7a1FF0711269bd20964168247dB76e5fda9f1f',
    })
    @ApiParam({
        name: 'heroId',
        required: true,
        description: 'The ID of the NFT within the collection',
        example: '1',
    })
    @Get('/heros/:collectionAddress/:heroId')
    async getByCollection( @Param('collectionAddress') collectionAddress: string,  @Param('heroId') heroId: string,) {

        this.validateAddress(collectionAddress);
        
        return this.nftService.aggregate([
            {
                $match: {
                    collection_address: collectionAddress,
                    nft_status: NFT_STATUS.LISTING_MARKET,
                    attributes: { $elemMatch: { value: heroId }}
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    nft_type: 0, // Exclude the nft_type field
                    minting_status: 0, // Exclude the minting_status field
                },
            },
        ]);
    }

    @ApiOperation({ description: 'Get nfts in collection', parameters: [{ name: 'collectionAddress', required: true, in: 'path' }] })
    @Get('/collection/:collectionAddress')
    async filterHeroIdInCollection( @Param('collectionAddress') collectionAddress: string) {

       this.validateAddress(collectionAddress);
        
        return this.nftService.aggregate([
            {
                $match: {
                    collection_address: collectionAddress,
                    nft_status: NFT_STATUS.LISTING_MARKET
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id (optional)
                    nft_type: 0, // Exclude the nft_type field
                    minting_status: 0, // Exclude the minting_status field
                },
            },
        ]);
    }
    private validateAddress(address: string) {
        if (!isAddress(address)) {
            throw new BadRequestException('Invalid address');
        }
    }

  


}