use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient USDC deposit")]
    InsufficientUsdcDeposit,
    #[msg("Unauthorized access")]
    UnauthorizedAccess,
    #[msg("Student not enrolled in the course")]
    StudentNotEnrolled,
    #[msg("Attendance already marked for the lesson")]
    AttendanceAlreadyMarked,
    #[msg("Late for the lesson")]
    LateForLesson,
    #[msg("Not ready for withdrawal")]
    NotReadyForWithdrawal,
    #[msg("Student already enrolled in the course")]
    StudentAlreadyEnrolled,
    #[msg("Exceeded the maximum number of lessons for the course")]
    ExceededCourseLessons,
}
