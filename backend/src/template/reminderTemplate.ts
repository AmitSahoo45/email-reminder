const reminderTemplate = (name: string, title: string, task: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <p>Hi ${name},</p>
    <p>This is a reminder to complete your task: ${task}.</p>
</body>
</html>
`;

export default reminderTemplate;