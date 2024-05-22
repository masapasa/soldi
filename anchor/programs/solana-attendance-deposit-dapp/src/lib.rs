mod errors;
mod program_accounts;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};
use errors::ErrorCode;
use program_accounts::contexts::*;
use program_accounts::structs::*;
declare_id!("3XkjQ2Z5QFVnrccwn7e58jyuCTk8DbPk39cuS8PAZkD8");

#[program]
pub mod solana_attendance_deposit_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let course_manager = &mut ctx.accounts.authority;
        course_manager.manager = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn create_course(
        ctx: Context<NewCourse>,
        name: String,
        deposit: u64,
        lock_until: u64,
        num_of_lessons: u8,
        course_description: String,
        category: String,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course;
        course.new(
            name,
            ctx.accounts.manager.key(),
            deposit,
            lock_until,
            num_of_lessons,
            course_description,
            category,
        )
    }

    pub fn register(ctx: Context<Registration>) -> Result<()> {
        let course = &mut ctx.accounts.course;
        let student = &ctx.accounts.student;
        let student_balance = ctx.accounts.student_usdc.amount;
        if student_balance < course.deposit {
            return Err(ErrorCode::InsufficientUsdcDeposit.into());
        }
        let cpi_accounts = Transfer {
            from: ctx.accounts.student_usdc.to_account_info(),
            to: ctx.accounts.course_usdc.to_account_info(),
            authority: ctx.accounts.student.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, course.deposit)?;
        course.register(student.key())
    }

    pub fn create_lesson(ctx: Context<CreateLesson>, attendance_deadline: u64) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.manager.key(),
            ctx.accounts.authority.manager.key(),
            ErrorCode::UnauthorizedAccess
        );
        let course = &mut ctx.accounts.course;
        let lesson = &mut ctx.accounts.lesson;
        lesson.new(course, attendance_deadline)
    }

    pub fn mark_attendance(ctx: Context<MarkAttendance>, lesson_id: u8) -> Result<()> {
        let course = &mut ctx.accounts.course;
        let student = &ctx.accounts.student;
        let attendance = &mut ctx.accounts.attendance;
        let lesson = &ctx.accounts.lesson;
        if !course.students.contains(&student.key()) {
            return Err(ErrorCode::StudentNotEnrolled.into());
        }
        if attendance.attendance.contains(&lesson_id) {
            return Err(ErrorCode::AttendanceAlreadyMarked.into());
        }
        let clock = Clock::get()?;
        if lesson.attendance_deadline < clock.unix_timestamp as u64 {
            return Err(ErrorCode::LateForLesson.into());
        }
        attendance.course = course.key();
        attendance.student = student.key();
        attendance.attendance.push(lesson_id);
        Ok(())
    }

    pub fn apply_for_loan(ctx: Context<LoanContext>, amount: u64, interest_rate: u8) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        loan.borrower = ctx.accounts.borrower.key();
        loan.lender = ctx.accounts.lender.key();
        loan.amount_borrowed = amount;
        loan.interest_rate = interest_rate;
        loan.is_paid_off = false;
        Ok(())
    }

    pub fn submit_feedback(ctx: Context<FeedbackContext>, rating: u8, comments: String) -> Result<()> {
        let feedback = &mut ctx.accounts.feedback;
        feedback.course_id = ctx.accounts.course.key();
        feedback.student = ctx.accounts.student.key();
        feedback.rating = rating;
        feedback.comments = comments;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdrawal>, bump: u8) -> Result<()> {
        let course = &ctx.accounts.course;
        let attendance = &mut ctx.accounts.attendance;
        let student = &ctx.accounts.student;
        let student_usdc = &mut ctx.accounts.student_usdc;
        let course_usdc = &mut ctx.accounts.course_usdc;
        require!(
            course.students.contains(&student.key()),
            ErrorCode::StudentNotEnrolled
        );
        require!(
            course.lock_until < Clock::get()?.unix_timestamp as u64,
            ErrorCode::NotReadyForWithdrawal
        );
        let seeds = &[course.name.as_bytes(), &[bump]];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: course_usdc.to_account_info(),
            to: student_usdc.to_account_info(),
            authority: course.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, course.deposit)?;
        attendance.withdrawn = true;
        Ok(())
    }
}

impl Lesson {
    pub fn new(&mut self, course: &mut Account<Course>, attendance_deadline: u64) -> Result<()> {
        let next_lesson_id = course.last_lesson_id + 1;
        if next_lesson_id > course.num_of_lessons {
            return Err(ErrorCode::ExceededCourseLessons.into());
        }
        course.last_lesson_id = next_lesson_id;
        self.course = course.key();
        self.lesson_id = next_lesson_id;
        self.attendance_deadline = attendance_deadline;
        Ok(())
    }
}

impl Course {
    pub fn new(
        &mut self,
        name: String,
        manager: Pubkey,
        deposit: u64,
        lock_until: u64,
        num_of_lessons: u8,
        course_description: String,
        category: String,
    ) -> Result<()> {
        self.name = name;
        self.manager = manager;
        self.deposit = deposit;
        self.lock_until = lock_until;
        self.num_of_lessons = num_of_lessons;
        self.last_lesson_id = 0;
        self.course_description = course_description;
        self.category = category;
        Ok(())
    }

    pub fn register(&mut self, student: Pubkey) -> Result<()> {
        if self.students.contains(&student) {
            return Err(ErrorCode::StudentAlreadyEnrolled.into());
        }
        self.students.push(student.key());
        self.total_enrollment += 1;
        Ok(())
    }
}
