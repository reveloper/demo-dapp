import { Base64 } from '@tonconnect/protocol';
import { Address, beginCell, contractAddress as calculateContractAddress, Cell, StateInit, toNano} from '@ton/ton';

const Wallet_OWNER = Address.parse("EQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIumAF"); //wallet contract address of current owner Jetton
const Wallet_DST = Address.parse("EQAOjqmTxl9F61boeM3nMioLTmW_Tqtq6pwkclE7_Yd5Q-8p"); // destination wallet contract address
const Jetton_Master = Address.parse("EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"); // Jetton Minter(Master) contract address, that will be transfered

const masterCode = Cell.fromBase64("te6cckECFgEABIwAART/APSkE/S88sgLAQIBYgIDAgLLBAUCAWoQEQS30IMcAkl8D4AHQ0wMBcbCSXwPg+kD6QDH6ADFx1yH6ADH6ADBzqbQAItMf0z9Z7UTQ+gDU1NHbPFB4Xwcq+kQpwBXjAlsnghB73ZfeuuMCMDFsIjcCghAsdrlzuoGBwgJAgEgDg8AXIBP+DMgbpUwgLH4M94gbvLSmtDTBzHT/9P/9ATTB9Qw0PoA+gD6APoA+gD6ADAB5jM4OTk5OQPA/1Fnuhaw8uGTAvpA+CdvEFAFoQT6APoA0XDIghAXjUUZWAcCyx/LPyL6AnDIywHJ0M8Wf1AJdMjLAhLKB8v/ydAYzxZQB/oCE8sAyVRGRPAcAqBmA8hQA/oCzMzJ7VSCEMBmDM/IWPoCyXAKAf4xNTU2OAP6APpAMPgoJnBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJcAH5AHTIywISygfL/8nQUAbHBfLhlFAkoVRgZMhQA/oCzMzJ7VTIUATPFhTMyfgnbxBYociAEAHLBVADf3RQA8sCEsoHy/9Y+gJxActqzMlwCwEQ4wJfB4QP8vAMAEiDB3GADMjLA8sBywgTy/8ClXFYy2HMmHBYy2EB0M8W4slw+wAAZPsAghDAdwzPyFj6AslwgwdxgAzIywPLAcsIE8v/ApVxWMthzJhwWMthAdDPFuLJcPsAAfxQNaAVvPLgSwP6QNMA0ZXIIc8WyZFt4siAGAHLBVADzxZw+gJwActqghDRc1QAWAQCyx/LPyL6RDDAAI42+ChDBHBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJcAH5AHTIywISygfL/8nQEs8WlmwicAHLAeL0AMkNAAiAQPsAAGe7kODeARwuoodSGEGEEyVMryVMYcQq3xgDSEmAACXMZmZFOEVKpEDfAgOWDgVKBcjYQ5OhAJm58FCIBuCoQCaoKAeQoAn0BLGeLAOeLZmSRZGWAiXoAegBlgGSQOAD8gDpkZYEJZQPl/+ToZEAMAOWCgOeLKAH9ATuA5bWJZmZkuH2AQIBWBITACm0aP2omh9AGpqaJgY6GmP6c/pg+jAAfa289qJofQBqami2EPwUALgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkuAD8gDpkZYEJZQPl/+ToQAHhrxb2omh9AGpqaLaBaGmP6c/pg+i9eAqBPXgKgMAIeArkRoOtDo6ODmdF5exOTSyM7KXOje3Fze5M5e6N7WytxfBniyxni0WZeYPEZ4sA54sQRalzU5t7dGeLZOgAxaFzg3M8Z4tk6AC4ZGWDgOeLZMAUAcSC8HDl17aimzkvhQdv4Vyi8gU8VsIzhyjE4zyejdse6CfMWAWDB/QXA3DIywcBzxbJgvBhBdbMdq9AAyXpTViM5RG+W/27c7Q33FHspDkX16Q+PVgEgwf0FwJwyMsHAc8WyRUAcILw7oD9Lx4DSA4igjY1lu51LXuyf1B3a5UIagJ5GJZ1kj5YA4MH9BdwyMsH9ADJf3DIywHJ0EADB9MHlg==")
const Jetton_DST = Address.parse("EQCQPfBZibKv5RQ7PJM3XrvSBcvg1uZel3wu5IU5BzvMsZJd");

export function generatePayload(sendTo: string): string {


    // transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
    // response_destination:MsgAddress custom_payload:(Maybe ^Cell)
    // forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
    // = InternalMsgBody;

    const op = 0xf8a7ea5; // jetton transfer
    const quiryId = 0;
    const messageBody = beginCell()
        .storeUint(op, 32)
        .storeUint(quiryId, 64)
        .storeCoins(toNano("1"))
        .storeAddress(Jetton_DST)
        .storeAddress(Wallet_OWNER)
        .storeUint(0, 1)
        .storeCoins(toNano(0.05))
        .endCell();

    return Base64.encode(messageBody.toBoc());
}


export function getAddressAndStateInit(ownerAddress: string): { address: string; stateInit: string } {
    const initialData = generateInitialData(ownerAddress);
    const address = generateContractAddress(initialData);
    const stateInit = generateStateInit(initialData);
    return { address, stateInit };
}



constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}
let master = system.open(Jetton_Master);

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
    return beginCell().endCell();
}

export class JettonWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonWallet(address);
    }

    static createFromConfig(config: JettonWalletConfig, code: Cell, workchain = 0) {
        const data = jettonWalletConfigToCell(config);
        const init = { code, data };
        return new JettonWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getJettonBalance(provider: ContractProvider) {
        let state = await provider.getState();
        if (state.state.type !== 'active') {
            return 0n;
        }
        let res = await provider.get('get_wallet_data', []);
        return res.stack.readBigNumber();
    }
    async sendTransfer(provider: ContractProvider, via: Sender,
                       value: bigint,
                       jetton_amount: bigint, to: Address,
                       responseAddress:Address,
                       customPayload: Cell,
                       forward_ton_amount: bigint,
                       forwardPayload: Cell) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonWallet.transferMessage(jetton_amount, to, responseAddress, customPayload, forward_ton_amount, forwardPayload),
            value:value
        });

    }

