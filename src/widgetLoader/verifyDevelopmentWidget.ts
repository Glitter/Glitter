import fs from 'fs-extra';
import catchify from 'catchify';
import path from 'path';
import { Either, left, right, isLeft } from 'fp-ts/lib/Either';
import semver from 'semver';
import { DevelopmentWidgetConfig } from '@appStore/development';

interface IVerifyDevelopmentWidgetInput {
  dir: string;
}

interface IConfigObject {
  glitter: typeof DevelopmentWidgetConfig.Type;
  [x: string]: any;
}

export const verifyDevelopmentWidget = async ({
  dir,
}: IVerifyDevelopmentWidgetInput): Promise<Either<
  string,
  typeof DevelopmentWidgetConfig.Type
>> => {
  // Check if directory exists
  const [pathExistsError]: [Error, undefined] = await catchify(
    fs.pathExists(dir),
  );

  if (pathExistsError) {
    return left(`Could not read a directory ${dir}`);
  }

  // Make sure package.json exists
  const configPath = path.resolve(dir, 'package.json');
  const [configExistsError, configExists]: [Error, boolean] = await catchify(
    fs.pathExists(configPath),
  );

  if (configExistsError || !configExists) {
    return left(`Could not read ${configPath}`);
  }

  const [configReadError, config]: [Error, IConfigObject] = await catchify(
    fs.readJson(configPath),
  );

  if (configReadError) {
    return left(`Could not read ${configPath}`);
  }

  if (typeof config.glitter !== 'object') {
    return left(`glitter key missing or not an object`);
  }

  const configValidationResult = verifyConfigObject(config.glitter);

  if (isLeft(configValidationResult)) {
    return configValidationResult;
  }

  return right(config.glitter);
};

const TITLE_MAX_LENGTH = 72;
const ALLOWED_TYPES = ['vue', 'react'];

const verifyConfigObject = (
  config: typeof DevelopmentWidgetConfig.Type,
): Either<string, string> => {
  const requiredKeys = ['title', 'type', 'version'];
  const missingKeys = requiredKeys.filter(
    requiredKey => config.hasOwnProperty(requiredKey) === false,
  );

  if (missingKeys.length) {
    return left(
      `Your config (package.json) is missing the following keys: ${missingKeys.join(
        ',',
      )}`,
    );
  }

  // Validate title
  if (typeof config.title !== 'string') {
    return left(
      `title should be a string, found ${typeof config.title} instead`,
    );
  }

  if (config.title.length > TITLE_MAX_LENGTH) {
    return left(
      `title should not be longer than ${TITLE_MAX_LENGTH} characters, ${config.title.length} found`,
    );
  }

  // Validate subtitle
  if (config.subtitle && typeof config.subtitle !== 'string') {
    return left(
      `subtitle should be a string, found ${typeof config.subtitle} instead`,
    );
  }

  // Validate description
  if (config.description && typeof config.description !== 'string') {
    return left(
      `description should be a string, found ${typeof config.description} instead`,
    );
  }

  // Validate type
  if (typeof config.type !== 'string') {
    return left(`type should be a string, found ${typeof config.type} instead`);
  }

  if (!ALLOWED_TYPES.includes(config.type)) {
    return left(
      `type is not a valid string. Found ${
        config.type
      }, expected one of: ${ALLOWED_TYPES.join(',')}`,
    );
  }

  // Validate version
  if (typeof config.version !== 'string') {
    return left(
      `version should be a string, found ${typeof config.version} instead`,
    );
  }

  if (!semver.valid(config.version)) {
    return left(
      `version should follow the semantic versioning specifications. Check https://semver.org for more details`,
    );
  }

  // Walidate dimensions
  if (typeof config.width !== 'number') {
    return left(
      `width should be a number, found ${typeof config.width} instead`,
    );
  }

  if (config.width <= 0) {
    return left('width should be higher than 0');
  }

  if (typeof config.height !== 'number') {
    return left(
      `height should be a number, found ${typeof config.height} instead`,
    );
  }

  if (config.height <= 0) {
    return left('height should be higher than 0');
  }

  return right('Config (package.json) validated successfully.');
};
