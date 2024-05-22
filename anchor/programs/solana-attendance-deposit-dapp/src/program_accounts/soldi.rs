use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint, Transfer};
use anchor_lang::solana_program::program_pack::Pack;

declare_id!("Fg6PaFyLnzJnEu4jbVUBqtWmNNtFNZrP1KAJ6iRsw9JU");

#[program]
pub mod education_platform {
    use super::*;
    /// Adds a new course to the platform
    pub fn new_course(ctx: Context<NewCourse>, name: String, lesson_capacity: u32) -> Result<()> {
        let course = &mut ctx.accounts.course;
        course.authority = ctx.accounts.manager.key();
        course.name = name;
        course.lesson_capacity = lesson_capacity;
        course.lesson_count = 0;
        Ok(())
    }

    /// Registers a student for the course
    pub fn register_student(ctx: Context<Registration>, course_name: String) -> Result<()> {
        let course = &mut ctx.accounts.course;
        let student = &mut ctx.accounts.student;
        // Validate that the course exists and can accept more students
        if course.lesson_capacity == course.lesson_count {
            return Err(ErrorCode::CourseIsFull.into());
        }
        // Register the student
        let registration = &mut ctx.accounts.registration;
        registration.student = student.key();
        registration.course = course.key();
        course.lesson_count += 1;
        Ok(())
    }

    /// Marks attendance for a student; attendance can only be marked once per lesson
    pub fn mark_attendance(ctx: Context<MarkAttendance>, lesson_id: u32) -> Result<()> {
        let attendance = &mut ctx.accounts.attendance;
        // Check if the student has already attended this lesson
        if attendance.lessons_attended.contains(&lesson_id) {
            return Err(ErrorCode::AlreadyAttended.into());
        }
        // Mark the attendance
        attendance.lessons_attended.push(lesson_id);
        if attendance.lessons_attended.len() as u32 == ctx.accounts.course.lesson_capacity {
            // Transfer reward if all lessons are attended
            let token_program = ctx.accounts.token_program.to_account_info();
            let to = ctx.accounts.student_usdc.to_account_info();
            let from = ctx.accounts.course_usdc.to_account_info();
            let authority = ctx.accounts.payer.to_account_info();
            let amount = 1000000; // 1 USDC, assuming 6 decimal places
            let transfer_instruction = Transfer {
                from: from.key,
                to: to.key,
                authority: authority.key,
            };
            anchor_spl::token::transfer(
                CpiContext::new(
                    token_program,
                    transfer_instruction.into(),
                    ),
                amount,
            )?;
        }
        Ok(())
    }
    // Add more methods here for loan management, feedbacks, etc.
}

#[derive(Accounts)]
pub struct NewCourse<'info> {
    #[account(init, payer = manager, space = 8 + 8 + 320)] // Adjust the space as needed based on Course data size
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub manager: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Registration<'info> {
    #[account(mut)]
    pub course: Account<'info, Course>,
    #[account(init, payer = student, space = 8 + 8 + 64 + 64)]
    pub registration: Account<'info, Registration>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarkAttendance<'info> {
    #[account(mut)]
    pub course: Account<'info, Course>,
    #[account(mut)]
    pub attendance: Account<'info, Attendance>,
    pub student: Signer<'info>,
    pub student_usdc: Account<'info, TokenAccount>,
    pub course_usdc: Account<'info, TokenAccount>,
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}


