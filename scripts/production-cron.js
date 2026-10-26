const fs = require('fs');
const path = require('path');

const { runProduction } = require('./run-production');

async function runCron() {
  const timestamp = new Date().toISOString();
  const logDir = path.join(__dirname, '..', 'logs');
  const logFile = path.join(logDir, 'production-runs.json');

  try {
    const result = await runProduction();

    const history = fs.existsSync(logFile)
      ? JSON.parse(fs.readFileSync(logFile, 'utf8'))
      : [];

    history.push({
      timestamp,
      status: 'success',
      result,
    });

    fs.mkdirSync(logDir, { recursive: true });
    fs.writeFileSync(logFile, JSON.stringify(history, null, 2));

    console.log(JSON.stringify({ timestamp, status: 'success', result }, null, 2));
  } catch (error) {
    const history = fs.existsSync(logFile)
      ? JSON.parse(fs.readFileSync(logFile, 'utf8'))
      : [];

    history.push({
      timestamp,
      status: 'error',
      error: error.message,
    });

    fs.mkdirSync(logDir, { recursive: true });
    fs.writeFileSync(logFile, JSON.stringify(history, null, 2));

    console.error('Cron run failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runCron();
}

module.exports = { runCron };
