export interface UserModel {
    userid: string;
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface userDetail {
    userid: string;
}

export interface emailOptions {
    to_email: string;
    subject: string;
    text?: string;
    html?: string;
}

