import { Keypair } from '@solana/web3.js';
import {
  useSolanaAttendanceDepositDappProgram,
  useSolanaAttendanceDepositDappProgramCourseAccount,
} from './solana-attendance-deposit-dapp-data-access';
import { CreateCourseForm } from './CreateCourseForm';

export function SolanaAttendanceDepositDappCreate() {
  const { initialize, accounts } = useSolanaAttendanceDepositDappProgram();

  return (
    <div className="flex flex-row justify-center items-center gap-3">
      <button
        className="btn btn-xs lg:btn-md btn-primary bg-amber-100 text-slate-600"
        onClick={() => initialize.mutateAsync(Keypair.generate())}
        disabled={initialize.isPending || accounts.data?.length === 1}
      >
        Initialize Course{initialize.isPending && '...'}
      </button>
    </div>
  );
}

export function SolanaAttendanceDepositDappProgram() {
  const { getProgramAccount } = useSolanaAttendanceDepositDappProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  // return (
  //   <div className={'space-y-6'}>
  //     <pre>{JSON.stringify(getProgramAccount.data.value, null, 2)}</pre>
  //   </div>
  // );
}

export function SolanaAttendanceDepositDappCourseManage() {
  const { accounts } = useSolanaAttendanceDepositDappProgram();

  return (
    <div className="my-2 p-6 poppins text-amber-100 border-gray-300 rounded-xl bg-slate-800 bg-opacity-50 shadow-2xl shadow ">
      <h2 className="text-center text-2xl">Course Manager</h2>

      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        accounts.data?.[0] && (
          <CreateCourseForm accounts={accounts.data[0].pubkey.toBase58()} />
        )
      )}
    </div>
  );
}

export function SolanaAttendanceDepositDappCourseList() {
  const { courseAccounts } =
    useSolanaAttendanceDepositDappProgramCourseAccount();

  // console.log('courseAccounts', courseAccounts.data);

  return (
    <div className="my-12 pb-20 bg-opacity-50 shadow shadow-2xl poppins text-amber-100 rounded-xl">
      <h2 className="mb-6 text-center text-3xl">Course List</h2>
      <div className="grid grid-cols-3 col-auto gap-6">
        {courseAccounts.data?.map((data) => {
          return (
            <div className="shadow shadow-2xl border p-4 rounded-lg mb-6">
              <p>Address: {data.publicKey.toString()}</p>
              <p>Manager Address: {data.account.manager.toString()}</p>
              <p>Course Name: {data.account.name}</p>
              <p>Deposit: {data.account.deposit.toString()}</p>
              <p>Lock Until: {data.account.lockUntil.toString()}</p>
              <p>Number of Lessons: {data.account.numOfLessons}</p>
              <p>Last Lesson ID: {data.account.lastLessonId}</p>
              <div>
                {data.account.students.length === 0 ? (
                  <p>Students: None</p>
                ) : (
                  <div>
                    <p>
                      Students:
                      {data.account.students.map((student) => (
                        <span>{student.toString()}</span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <button className="btn btn-xs lg:btn-md btn-primary">
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
