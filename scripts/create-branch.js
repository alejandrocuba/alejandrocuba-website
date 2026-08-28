#!/usr/bin/env node

import { execSync } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const TYPES = [
  { value: 'feat', label: 'feat     (Nueva funcionalidad -> MINOR bump)' },
  { value: 'fix', label: 'fix      (Corrección de bug -> PATCH bump)' },
  { value: 'chore', label: 'chore    (Mantenimiento, CI, dependencias -> Sin bump)' },
  { value: 'perf', label: 'perf     (Rendimiento / Optimización -> PATCH bump)' },
  { value: 'refactor', label: 'refactor (Refactorización de código -> Sin bump)' },
  { value: 'docs', label: 'docs     (Documentación -> Sin bump)' },
  { value: 'style', label: 'style    (Formato, espacios, CSS cosmético -> Sin bump)' },
];

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales por guiones
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y fin
}

async function main() {
  const args = process.argv.slice(2);
  let type = '';
  let description = '';

  if (args.length >= 2) {
    // Modo directo por argumentos: pnpm branch <tipo> <descripcion>
    type = slugify(args[0]);
    description = slugify(args.slice(1).join(' '));
  } else {
    // Modo interactivo
    const rl = readline.createInterface({ input, output });

    console.log('\n🌿 \x1b[1mAsistente de Ramas Git (Conventional SemVer)\x1b[0m\n');
    console.log('Selecciona el tipo de cambio:');
    TYPES.forEach((t, index) => {
      console.log(`  \x1b[36m[${index + 1}]\x1b[0m ${t.label}`);
    });

    const choice = await rl.question('\nNúmero de opción [1-7] (default 1): ');
    const selectedIndex = parseInt(choice.trim(), 10) - 1;
    const selectedType = TYPES[selectedIndex] ? TYPES[selectedIndex].value : TYPES[0].value;
    type = selectedType;

    const descInput = await rl.question('Descripción corta del cambio: ');
    rl.close();

    description = slugify(descInput);
  }

  if (!description) {
    console.error('\n\x1b[31m✖ Error: Debes proporcionar una descripción para la rama.\x1b[0m\n');
    process.exit(1);
  }

  const branchName = `${type}/${description}`;

  try {
    console.log(`\n⏳ Creando y cambiando a la rama: \x1b[32m${branchName}\x1b[0m...`);
    execSync(`git checkout -b "${branchName}"`, { stdio: 'inherit' });
    console.log(`\n\x1b[32m✔ ¡Listo! Ahora estás en la rama:\x1b[0m \x1b[1m${branchName}\x1b[0m`);
    console.log(`\x1b[33m💡 Recordatorio:\x1b[0m Tu mensaje de commit y título de PR deben empezar con: \x1b[36m${type}: <descripción>\x1b[0m\n`);
  } catch (error) {
    console.error(`\n\x1b[31m✖ No se pudo crear la rama "${branchName}".\x1b[0m`, error.message);
    process.exit(1);
  }
}

main();
