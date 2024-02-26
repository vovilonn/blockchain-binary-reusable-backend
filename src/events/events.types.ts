import { TypedContractEvent, TypedEventLog } from "../typechain.types";

export type EventLogWithOutObject<OutTuple extends any[] = any[], OutObject = object> = TypedEventLog<
    TypedContractEvent<any, OutTuple, OutObject>
>;
