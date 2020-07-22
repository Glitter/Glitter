import fs from 'fs-extra';
import catchify from 'catchify';
import path from 'path';
import { Either, Left, left, right, isLeft, fold } from 'fp-ts/lib/Either';
import {
  PACKAGE_JSON,
  WIDGET_VUE,
  WIDGET_REACT,
  INDEX_REACT,
  CSS_REACT,
  INDEX_VUE,
  INDEX_HTML,
} from '@widgetCreator/fileTemplates';

interface CreateVueFilesInputInterface {
  title: string;
  subtitle: string;
  description: string;
  dir: string;
  width: number;
  height: number;
}

const createVueFiles = async ({
  title,
  subtitle,
  description,
  dir,
  width,
  height,
}: CreateVueFilesInputInterface): Promise<Either<string, string[]>> => {
  const files = [
    {
      name: 'package.json',
      contents: PACKAGE_JSON({
        title,
        subtitle,
        type: 'vue',
        description,
        width,
        height,
      }),
    },
    {
      name: 'Widget.vue',
      contents: WIDGET_VUE(),
    },
    {
      name: 'index.js',
      contents: INDEX_VUE(),
    },
    {
      name: 'index.html',
      contents: INDEX_HTML({ type: 'vue' }),
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileWrites: Promise<Either<any, any>>[] = [];

  files.forEach((file) => {
    fileWrites.push(
      (async (): Promise<Either<string, string>> => {
        const pathToWriteTo = path.resolve(dir, file.name);

        const [fileWriteError]: [Error, undefined] = await catchify(
          fs.outputFile(pathToWriteTo, file.contents),
        );

        if (fileWriteError) {
          return left(`Could not write to ${pathToWriteTo}`);
        }

        return right(pathToWriteTo);
      })(),
    );
  });

  const [filesWriteError, filesWritten]: [
    Error,
    Either<string, string>[],
  ] = await catchify(Promise.all(fileWrites));

  if (filesWriteError) {
    return left('Something went wrong while writing the files.');
  }

  const filesWrittenLeft = filesWritten.find((fileWritten) =>
    isLeft(fileWritten),
  );

  if (filesWrittenLeft) {
    return filesWrittenLeft as Left<string>;
  }

  // Looks like all files were successfully written
  return right(
    filesWritten.map((fileWritten) =>
      fold(
        (x: string): string => x,
        (x: string): string => x,
      )(fileWritten),
    ),
  );
};

interface CreateReactFilesInputInterface {
  title: string;
  subtitle: string;
  description: string;
  dir: string;
  width: number;
  height: number;
}

const createReactFiles = async ({
  title,
  subtitle,
  description,
  dir,
  width,
  height,
}: CreateReactFilesInputInterface): Promise<Either<string, string[]>> => {
  const files = [
    {
      name: 'package.json',
      contents: PACKAGE_JSON({
        title,
        subtitle,
        type: 'react',
        description,
        width,
        height,
      }),
    },
    {
      name: 'Widget.jsx',
      contents: WIDGET_REACT(),
    },
    {
      name: 'index.jsx',
      contents: INDEX_REACT(),
    },
    {
      name: 'index.html',
      contents: INDEX_HTML({ type: 'react' }),
    },
    {
      name: 'widget.css',
      contents: CSS_REACT(),
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileWrites: Promise<Either<any, any>>[] = [];

  files.forEach((file) => {
    fileWrites.push(
      (async (): Promise<Either<string, string>> => {
        const pathToWriteTo = path.resolve(dir, file.name);

        const [fileWriteError]: [Error, undefined] = await catchify(
          fs.outputFile(pathToWriteTo, file.contents),
        );

        if (fileWriteError) {
          return left(`Could not write to ${pathToWriteTo}`);
        }
        return right(pathToWriteTo);
      })(),
    );
  });

  const [filesWriteError, filesWritten]: [
    Error,
    Either<string, string>[],
  ] = await catchify(Promise.all(fileWrites));

  if (filesWriteError) {
    return left('Something went wrong while writing the files.');
  }

  const filesWrittenLeft = filesWritten.find((fileWritten) =>
    isLeft(fileWritten),
  );

  if (filesWrittenLeft) {
    return filesWrittenLeft as Left<string>;
  }

  // Looks like all files were successfully written
  return right(
    filesWritten.map((fileWritten) =>
      fold(
        (x: string): string => x,
        (x: string): string => x,
      )(fileWritten),
    ),
  );
};

interface CreateFilesInputInterface {
  title: string;
  subtitle?: string;
  type: 'vue' | 'react';
  description?: string;
  dir: string;
  width: number;
  height: number;
}

export const createFiles = async ({
  title,
  subtitle = '',
  type,
  description = '',
  dir,
  width,
  height,
}: CreateFilesInputInterface): Promise<
  Either<string, { files: string[]; dir: string }>
> => {
  const finalDir = path.resolve(dir, title);

  // We create a directory if it does not already exist
  const [ensureDirError]: [Error, undefined] = await catchify(
    fs.ensureDir(finalDir),
  );

  if (ensureDirError) {
    return left(`Could not create a directory ${title} under ${dir}`);
  }

  // Now that we have a directory, let's check if it's empty. We don't want to
  // write into a non-empty directory (so as not to overwrite potentially
  // important files)
  const [readdirError, contents]: [Error, string[]] = await catchify(
    fs.readdir(finalDir),
  );

  if (readdirError) {
    return left(`Directory created but could not be read under ${dir}`);
  }

  if (contents.length) {
    return left(
      `Directory ${finalDir} is not empty. We decided not to write there so as not to overwrite potentially important files`,
    );
  }

  // Time to write the files
  const [filesWrittenError, filesWritten]: [Error, Either<string, string[]>] =
    type === 'vue'
      ? await catchify(
          createVueFiles({
            title,
            subtitle,
            description,
            dir: finalDir,
            width,
            height,
          }),
        )
      : await catchify(
          createReactFiles({
            title,
            subtitle,
            description,
            dir: finalDir,
            width,
            height,
          }),
        );

  if (filesWrittenError) {
    return left('Something went wrong while writing the files');
  }

  if (isLeft(filesWritten)) {
    return filesWritten;
  }

  return right({
    files: filesWritten.right,
    dir: finalDir,
  });
};
