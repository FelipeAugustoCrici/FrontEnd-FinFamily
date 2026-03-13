import chalk from 'chalk';

function startSpinner(message) {
  let spinnerFrames = ['-', '\\', '|', '/'];
  let frame = 0;
  return setInterval(() => {
    process.stdout.write(`\r${message} ${spinnerFrames[frame++]} -`);
    frame %= spinnerFrames.length;
  }, 100);
}

const log = async () => {
  console.info(
    chalk.blue.bold(
      `
          ################################################################################
                                            Crud Creator
          ################################################################################
        `,
    ),
  );

  console.info(
    chalk.green(
      `
                        Script for initialization and create pages by entity names.
          
                                Created by Felipe Gross Augusto
            `,
    ),
  );

  console.info(
    chalk.blue.bold(`
          #################################################################################
            `),
  );

  const spinner = startSpinner('Starting script...');
  await sleep(2000);

  clearInterval(spinner);
  process.stdout.write('\r');
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export { log, sleep };
