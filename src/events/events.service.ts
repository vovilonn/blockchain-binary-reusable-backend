import { Inject, Injectable } from "@nestjs/common";
import { EventKey } from "./events.constants";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { TypedContractEvent, TypedEventLog } from "../typechain.types";
import { EventLogWithOutObject } from "./events.types";

@Injectable()
export class EventsService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    private isSyncJobRunning: Map<EventKey, boolean> = new Map<EventKey, boolean>();

    public async listenForEvents<OutTuple extends any[] = any[], OutObject = object>(
        eventKey: EventKey,
        contract: any,
        filter: any,
        callback: (event: EventLogWithOutObject<OutTuple, OutObject>) => void,
        maxBlocksPerIteration: number = 10
    ) {
        if (this.isSyncJobRunning.get(eventKey)) {
            return;
        }

        try {
            let lastProcessedBlock = await this.cacheManager.get<number>(eventKey);
            let lastBlockNumber: number;

            if (contract?.runner?.provider) {
                lastBlockNumber = Number(await contract.runner.provider.getBlockNumber());
            }

            if (!lastProcessedBlock) {
                lastProcessedBlock = lastBlockNumber;
                await this.cacheManager.set(eventKey, lastProcessedBlock);
            }

            if (!lastBlockNumber) {
                throw new Error("Cannot get last block number");
            }

            if (lastProcessedBlock >= lastBlockNumber) {
                this.isSyncJobRunning.set(eventKey, false);
                return;
            }

            const endContractBlock = Math.min(lastProcessedBlock + maxBlocksPerIteration, lastBlockNumber);

            const events: EventLogWithOutObject<OutTuple, OutObject>[] = await contract.queryFilter(
                filter,
                lastProcessedBlock + 1,
                endContractBlock
            );

            for (const event of events) {
                const eventHashKey = `${eventKey}_${event.transactionHash}`;
                const transactionProcessed = await this.cacheManager.get(eventHashKey);
                if (transactionProcessed) continue;
                await callback(event);
                await this.cacheManager.set(eventHashKey, true);
                if (event.blockNumber > lastProcessedBlock) lastProcessedBlock = event.blockNumber;
            }

            await this.cacheManager.set(eventKey, endContractBlock);

            this.isSyncJobRunning.set(eventKey, false);
        } catch (err) {
            this.isSyncJobRunning.set(eventKey, false);
            console.error(err);
        }
    }
}
