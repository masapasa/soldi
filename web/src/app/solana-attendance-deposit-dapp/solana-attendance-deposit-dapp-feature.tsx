import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink, ExplorerButton } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useSolanaAttendanceDepositDappProgram } from './solana-attendance-deposit-dapp-data-access';
import {
  SolanaAttendanceDepositDappCreate,
  SolanaAttendanceDepositDappProgram,
  SolanaAttendanceDepositDappCourseManage,
  SolanaAttendanceDepositDappCourseList,
} from './solana-attendance-deposit-dapp-ui';

export default function SolanaAttendanceDepositDappFeature() {
  const { publicKey } = useWallet();
  const { programId } = useSolanaAttendanceDepositDappProgram();

  return publicKey ? (
    <div className="poppins">
      <AppHero
        title={'Course Management'}
        subtitle={'Initialize the course app by clicking the button below.'}
      >
        <div className="flex flex-row justify-center items-center gap-2 ">
          <SolanaAttendanceDepositDappCreate />
          <ExplorerButton
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </div>
      </AppHero>
      <SolanaAttendanceDepositDappProgram />
      <div className="flex flex-col items-center justify-center">
        <div>
          <SolanaAttendanceDepositDappCourseManage />
        </div>
        <div>
          <SolanaAttendanceDepositDappCourseList />
        </div>
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
