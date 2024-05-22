import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { SolanaAttendanceDepositDapp } from '../target/types/solana_attendance_deposit_dapp';

describe('solana-attendance-deposit-dapp', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .SolanaAttendanceDepositDapp as Program<SolanaAttendanceDepositDapp>;

  it('should run the program', async () => {
    // Add your test here.
    const tx = await program.methods.greet().rpc();
    console.log('Your transaction signature', tx);
  });
});

