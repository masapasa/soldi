#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Loan {
    pub borrower: Pubkey,
    pub lender: Pubkey,
    pub amount_borrowed: u64,
    pub interest_rate: u8,
    pub is_paid_off: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Feedback {
    pub course_id: Pubkey,
    pub student: Pubkey,
    pub rating: u8,
    pub comments: String,
}

#[account]
pub struct ScholarshipFund {
    pub fund_id: Pubkey,
    pub total_amount: u64,
    pub available_amount: u64,
}

#[account]
pub struct Course {
    pub name: String,
    pub manager: Pubkey,
    pub deposit: u64,
    pub lock_until: u64,
    pub num_of_lessons: u8,
    pub last_lesson_id: u8,
    pub students: Vec<Pubkey>,
    pub total_enrollment: u32,
    pub course_description: String,
    pub category: String,
}

#[account]
pub struct CourseManager {
    pub manager: Pubkey,
}

#[account]
pub struct Lesson {
    pub course: Pubkey,
    pub lesson_id: u8,
    pub attendance_deadline: u64,
}

#[account]
pub struct Registration {
    pub student: Pubkey,
    pub course: Pubkey,
}

#[account]
pub struct Attendance {
    pub course: Pubkey,
    pub student: Pubkey,
    pub attendance: Vec<u8>,
    pub withdrawn: bool,
}
