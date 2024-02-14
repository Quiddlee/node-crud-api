/**
 * Checks if the application is running in multi mode.
 * @returns {boolean} True if running in the multi mode.
 */
const isMulti = () => {
  return process.argv.slice(2).at(0)?.replace('--multi=', '') === 'true';
};

export default isMulti;
