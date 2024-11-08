'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {
    async initLedger(ctx) {
        console.info('Initializing Ledger...');
        const assets = [
            { ID: 'asset1', color: 'blue', size: 5, owner: 'Tom', appraisedValue: 300 },
            { ID: 'asset2', color: 'red', size: 10, owner: 'Jerry', appraisedValue: 500 }
        ];
        for (const asset of assets) {
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
        }
    }

    async createAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.assetExists(ctx, id);
        if (exists) {
            throw new Error(`Asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            color: color,
            size: parseInt(size),
            owner: owner,
            appraisedValue: parseInt(appraisedValue)
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    async readAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async deleteAsset(ctx, id) {
        const exists = await this.assetExists(ctx, id);
        if (!exists) {
            throw new Error(`Asset ${id} does not exist`);
        }
        await ctx.stub.deleteState(id);
    }

    async assetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

module.exports = AssetTransfer;
