// Here we export some useful types and functions for interacting with the Anchor program.
import { PublicKey } from '@solana/web3.js';
import type { SolanaAttendanceDepositDapp } from '../target/types/soldi';
import { IDL as SolanaAttendanceDepositDappIDL } from '../target/types/soldi';

// Re-export the generated IDL and type
export { SolanaAttendanceDepositDapp, SolanaAttendanceDepositDappIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const programId = new PublicKey(
  '3XkjQ2Z5QFVnrccwn7e58jyuCTk8DbPk39cuS8PAZkD8'
);
