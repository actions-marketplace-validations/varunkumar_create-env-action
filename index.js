import { getInput, setFailed, setOutput } from '@actions/core';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const VALID = '***';
const INVALID = 'INVALID';

function sanitize(secrets) {
  return Object.keys(secrets).reduce((final, key) => {
    const valid = typeof secrets[key] === 'string' && secrets[key].length > 0;

    return {
      ...final,
      [key]: valid ? VALID : INVALID,
    };
  }, {});
}

function format(secrets) {
  return Object.keys(secrets)
    .map((key) => {
      return `${key}="${secrets[key]}"`;
    })
    .join('\n');
}

function read(fileLocation) {
  try {
    const data = dotenv.config({ path: fileLocation }).parsed;
    return data;
  } catch (error) {
    throw new Error(
      `Unable to parse dotenv file: ${fileLocation}, ${
        error ? error.message : ''
      }`
    );
  }
}

try {
  const raw = getInput('env');
  const filename = getInput('file');
  const pathname = getInput('path');

  // parse the raw input using dotenv
  const parsed = dotenv.parse(raw);
  setOutput('parsed', parsed);
  console.log('Env data parsed');

  const fullpath = path.resolve(__dirname, pathname, filename);
  setOutput('location', fullpath);

  const generated = format(parsed);
  fs.writeFileSync(fullpath, generated);
  console.log(`.env file created in ${fullpath}`);

  const found = read(fullpath);
  console.log('Env data read from file');
  const sanitized = sanitize(found);
  setOutput('sanitized', sanitized);

  setOutput('success', true);
} catch (error) {
  setFailed(error.message);
}
