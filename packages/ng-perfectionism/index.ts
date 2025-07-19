#!/usr/bin/env node

import { CurrentDirectory } from '@chris.araneo/file-system';
import { Project } from 'ts-morph';

import { NgPerfectionism } from './src/ng-perfectionism';

console.log('NgPerfectionism');

const ngPerfectionism = new NgPerfectionism();

const directory = new CurrentDirectory().getCurrentDirectory();

console.log('Current working directory:', directory);

console.log('Resolving prettier config file');

ngPerfectionism.resolvePrettierConfig(directory).then((prettierOptions) => {
  if (prettierOptions) {
    console.log('Resolved prettier config');
  } else {
    console.log('Could not find prettier config');
  }

  ngPerfectionism
    .findFiles(/\.component\.ts$/, directory)
    .then(({ result }) => {
      const project = new Project();

      for (const path of result) {
        let sourceFile = project.addSourceFileAtPathIfExists(path);
        const relativePath = path.replace(directory, '');

        if (!sourceFile) {
          sourceFile = project.addSourceFileAtPathIfExists(relativePath);
        }

        if (!sourceFile) {
          throw new Error(`Can't read source file: ${path} (${relativePath})`);
        }

        ngPerfectionism
          .organizeMetadataObject(sourceFile, prettierOptions)
          .then((updatedSourceFile) => {
            updatedSourceFile.save();
          });
      }
    });

  // TODO Refactoring
  ngPerfectionism.findFiles(/\.module\.ts$/, directory).then(({ result }) => {
    const project = new Project();

    for (const path of result) {
      let sourceFile = project.addSourceFileAtPathIfExists(path);
      const relativePath = path.replace(directory, '');

      if (!sourceFile) {
        sourceFile = project.addSourceFileAtPathIfExists(relativePath);
      }

      if (!sourceFile) {
        throw new Error(`Can't read source file: ${path} (${relativePath})`);
      }

      ngPerfectionism
        .organizeMetadataObject(sourceFile, prettierOptions)
        .then((updatedSourceFile) => {
          updatedSourceFile.save();
        });
    }
  });
});
