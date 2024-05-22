import React from 'react';
import { useSolanaAttendanceDepositDappProgramCourseAccount } from './solana-attendance-deposit-dapp-data-access';

export const CreateCourseForm: React.FC<{ accounts: string }> = ({
  accounts,
}) => {
  const [name, setName] = React.useState('');
  const [deposit, setDeposit] = React.useState(0);
  const [lockUntil, setLockUntil] = React.useState(0);
  const [numOfLessons, setNumOfLessons] = React.useState(0);
  const [message, setMessage] = React.useState('');

  const { createCourse } = useSolanaAttendanceDepositDappProgramCourseAccount();

  const handleClick = () => {
    setMessage('');

    const courseInputs = {
      name: name,
      deposit: deposit,
      lock_until: lockUntil,
      num_of_lessons: numOfLessons,
    };

    // console.log('courseInputs', courseInputs)
    createCourse
      .mutateAsync(courseInputs)
      .then(() => {
        setMessage('Course created successfully');
        setName('');
        setDeposit(0);
        setLockUntil(0);
        setNumOfLessons(0);
      })
      .catch((error) => {
        setMessage(`Error creating course: ${error.message}`);
      });
  };

  return (
    <div className="flex justify-between my-6">
      <div>
        <div>Account: {accounts}</div>
        <div className="my-6">
          <form>
            <div className="mt-4">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-transparent border-2 border-gray-500 w-full py-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="deposit">Deposit:</label>
              <input
                type="number"
                id="deposit"
                name="deposit"
                className="bg-transparent border-2 border-gray-500 w-full py-1"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="lock_until">Lock Until:</label>
              <input
                type="number"
                id="lock_until"
                name="lock_until"
                className="bg-transparent border-2 border-gray-500 w-full py-1"
                value={lockUntil}
                onChange={(e) => setLockUntil(Number(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="num_of_lessons">Number of Lessons:</label>
              <input
                type="number"
                id="num_of_lessons"
                name="num_of_lessons"
                className="bg-transparent border-2 border-gray-500 w-full py-1"
                value={numOfLessons}
                onChange={(e) => setNumOfLessons(Number(e.target.value))}
              />
            </div>
          </form>
        </div>

        <button
          className="btn btn-xs lg:btn-md btn-primary"
          onClick={handleClick}
        >
          Create a course{createCourse.isPending && '...'}
        </button>
        {message && <div className="mt-4">{message}</div>}
      </div>
    </div>
  );
};
