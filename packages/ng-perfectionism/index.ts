import { CurrentDirectory, FileFinder } from '@chris.araneo/file-system';
import { Project } from 'ts-morph';

import { NgPerfectionism } from './src/ng-perfectionism';

const ngPerfectionism = new NgPerfectionism();

const fileFinder = new FileFinder();
const currentDirectory = new CurrentDirectory().getCurrentDirectory();

fileFinder
  .findFile(/\.component\.ts$/, currentDirectory)
  .subscribe(({ result }) => {
    console.log(result);

    const project = new Project();

    result.forEach((path) => {
      const sourceFile = project.addSourceFileAtPath(path);

      ngPerfectionism.organizeComponentMetadataObject(sourceFile);

      sourceFile.save();
    });
  });
