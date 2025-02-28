#!/usr/bin/env node

import { CurrentDirectory, FileFinder } from '@chris.araneo/file-system';
import { Project } from 'ts-morph';

import { NgPerfectionism } from './src/ng-perfectionism';

console.log('NgPerfectionism');

const ngPerfectionism = new NgPerfectionism();

const fileFinder = new FileFinder();
const currentDirectory = new CurrentDirectory().getCurrentDirectory();

console.log('Current working directory:', currentDirectory);
console.log('Searching component files...');

fileFinder
  .findFile(/\.component\.ts$/, currentDirectory)
  .subscribe(({ result }) => {
    const project = new Project();

    result.forEach((path) => {
      let sourceFile = project.addSourceFileAtPathIfExists(path);
      const relativePath = path.replace(currentDirectory, '');

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
