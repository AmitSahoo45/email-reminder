import fs from 'fs';
import path from 'path';

const createReport = async (content: string) => {
    const now = new Date();
    const month = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const date = now.getDate().toString().padStart(2, '0');
    const reportDir = path.join(__dirname, 'reports', month);
    const reportFile = path.join(reportDir, `${date}.txt`);

    if (!fs.existsSync(reportDir))
        fs.mkdirSync(reportDir, { recursive: true });

    fs.appendFileSync(reportFile, `${content}\n`, 'utf8');
};

export default createReport;
