#!/usr/bin/env node

import { CurrentDirectory } from '@chris.araneo/file-system';
import { Project } from 'ts-morph';

import { NgPerfectionism } from './src/ng-perfectionism';

console.log('NgPerfectionism');

const ngPerfectionism = new NgPerfectionism();

const directory = new CurrentDirectory().getCurrentDirectory();

console.log('Current working directory:', directory);
console.log('Searching component files...');

ngPerfectionism.findFiles(directory).then(({ result }) => {
  const project = new Project();

  result.forEach((path) => {
    let sourceFile = project.addSourceFileAtPathIfExists(path);
    const relativePath = path.replace(directory, '');

    if (!sourceFile) {
      sourceFile = project.addSourceFileAtPathIfExists(relativePath);
    }

    if (!sourceFile) {
      throw new Error(`Can't read source file: ${path} (${relativePath})`);
    }

    ngPerfectionism.organizeComponentMetadataObject(sourceFile);

    sourceFile.save();
  });
});
