import { REQUIRED_USER_FIELDS } from '../const';

const findMissingFields = (body: Record<string, string> | undefined) => {
  if (!body) return REQUIRED_USER_FIELDS;

  return REQUIRED_USER_FIELDS.map((field) => {
    const isFieldExist = Object.keys(body).includes(field);
    if (isFieldExist) return null;
    return field;
  }).filter(Boolean);
};

export default findMissingFields;
