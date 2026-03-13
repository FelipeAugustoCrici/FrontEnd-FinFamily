import readline from 'readline';

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

async function getInteractiveInputs() {
  const module_name = await askQuestion('Qual é o nome do módulo? ');
  const artigo = await askQuestion(
    'Qual é o artigo ? (a (femenino) ou o (masculino)) ',
  );
  const name = await askQuestion('Qual o nome visível? ');
  const plural = await askQuestion('S para plural ?');
  let plu = '';
  if (plural.toLowerCase() === 's') plu = 's';
  return { module: module_name, artigo, name, plural: plu };
}

export { getInteractiveInputs };