const otpTemplate = (name: string, otp: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        .otp {
            font-weight: bold;
        }
        .validity {
            color: red;
        }
    </style>
</head>
<body>
    <p>Hi ${name},</p>
    <p>Thank you for registering.</p>
    <p>Your OTP is <span class="otp">${otp}</span>.</p>
    <p>It will be valid for <span class="validity">10 minutes</span>.</p>
</body>
</html>
`;

export default otpTemplate;