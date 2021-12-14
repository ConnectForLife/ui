import { AGE, BIRTHDATE, DISPLAY, GENDER, OPENMRS_ID, TELEPHONE_NUMBER_ATTRIBUTE_TYPE } from './patient';

export const RETURN_LOCATION = '/openmrs/adminui/metadata/configureMetadata.page';
export const COLUMNS_CONFIGURATION_SETTING_KEY = 'cflui.findPatientRecordColumnsConfiguration';
export const DEFAULT_COLUMN_CONFIGURATION = { label: '', value: '', isValid: true };
export const FIXED_COLUMNS = [
  { label: 'Identifier', value: OPENMRS_ID },
  { label: 'Name', value: DISPLAY },
  { label: 'Age', value: AGE }
];
export const DEFAULT_COLUMNS = [
  ...FIXED_COLUMNS,
  { label: 'Gender', value: GENDER },
  { label: 'Birthdate', value: BIRTHDATE },
  { label: TELEPHONE_NUMBER_ATTRIBUTE_TYPE, value: TELEPHONE_NUMBER_ATTRIBUTE_TYPE }
];
