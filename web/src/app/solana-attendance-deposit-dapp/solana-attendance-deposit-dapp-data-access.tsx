import {
  programId,
  SolanaAttendanceDepositDappIDL,
} from '@solana-attendance-deposit-dapp/anchor';
import { Program, web3, utils, BN } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useSolanaAttendanceDepositDappProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const program = new Program(
    SolanaAttendanceDepositDappIDL,
    programId,
    provider
  );

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const accounts = useQuery({
    queryKey: ['solanaAttendanceDepositDapp', 'accounts', { cluster }],
    queryFn: () => program.provider.connection.getProgramAccounts(programId),
  });

  const initialize = useMutation({
    mutationKey: ['solanaAttendanceDepositDapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({
          authority: keypair.publicKey,
        })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to run program'),
  });

  return {
    accounts,
    program,
    programId,
    getProgramAccount,
    initialize,
  };
}

export function useSolanaAttendanceDepositDappProgramCourseAccount() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const { program } = useSolanaAttendanceDepositDappProgram();

  const courseAccounts = useQuery({
    queryKey: ['solanaAttendanceDepositDapp', 'course_accounts', { cluster }],
    queryFn: () => program.account.course.all(),
  });

  const createCourse = useMutation({
    mutationKey: ['solanaAttendanceDepositDapp', 'create_course', { cluster }],
    mutationFn: (args: {
      name: string;
      deposit: number;
      lock_until: number;
      num_of_lessons: number;
    }) => {
      const [coursePDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from(utils.bytes.utf8.encode(args.name))],
        programId
      );

      return program.methods
        .createCourse(
          args.name,
          new BN(args.deposit),
          new BN(args.lock_until),
          args.num_of_lessons
        )
        .accounts({
          course: coursePDA,
          manager: provider.wallet.publicKey,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to run program'),
  });

  return {
    courseAccounts,
    createCourse,
  };
}
