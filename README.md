# Soldi

1. **Loan Management:** Enabling the implementation of variable-interest loans that students could apply for, to fund their courses or other educational needs.

2. **Incentivization for Course Completion:** Besides just attendance, further rewards for completing the entire course or scoring well in assessments could be implemented.

3. **Reinvestment Options for Students:** Facilitate students to reinvest their earned USDC into different investment options directly from the platform.

4. **Scholarship Fund:** Allow benefactors to contribute to a scholarship fund that gets distributed among outstanding or underprivileged students.

5. **Feedback System:** Implementing a feedback mechanism for students to rate courses and instructors, thus fostering a quality education environment.

6. **Liquidity Pool Management:** Dynamic management of interest rates based on pool size and demand for loans.

Our platform provides comprehensive blockchain education solution including creating, registering for courses, marking attendance, and rewarding student attendance. Enhanced features such as loan management, feedback, and additional reinvestment options would require more comprehensive state management and are suggested to be developed accordingly.

## Overview

at soldi, we reward students for attending courses. the reward is in the form of USDC. the course manager can create courses and lessons. students can register for courses and mark their attendance. students can withdraw their rewards after attending all the lessons. the course manager can withdraw the USDC from the course account. investors can deposit usdc into a liquidity pool. this liquidity pool can be used both the reawards as well as loan to students. students can pay back their loans using the USDC rewards. the students can restake their rewards in the liquidity pool and payback the loan. what other features can be added to this program?". give me only complete correct modified rust anchor solana smart contract

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.70.0 or higher
- Anchor CLI 0.29.0 or higher
- Solana CLI 1.17.0 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/basic-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```
