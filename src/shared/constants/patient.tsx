// patient/person's defaultFields
export const PATIENT_IDENTIFIER = 'patientIdentifier';
export const OPENMRS_ID = 'OpenMRS ID';
export const DISPLAY = 'display';
export const GENDER = 'gender';
export const AGE = 'age';
export const BIRTHDATE = 'birthdate';
export const DEATH_DATE = 'deathDate';
export const PHONE_NUMBER = 'phoneNumber';
export const PERSON_LANGUAGE = 'personLanguage';
export const PERSON_IDENTIFIER = 'personIdentifier';
export const GIVEN_NAME = 'givenName';
export const MIDDLE_NAME = 'middleName';
export const FAMILY_NAME = 'familyName';

// attribute types
export const TELEPHONE_NUMBER_ATTRIBUTE_TYPE = 'Telephone Number';
export const PERSON_LANGUAGE_ATTRIBUTE_TYPE = 'personLanguage';
export const LOCATION_ATTRIBUTE_TYPE = 'LocationAttribute';
export const PERSON_IDENTIFIER_ATTRIBUTE_TYPE = 'Person identifier';

// table column defaults
export const DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS = `${PATIENT_IDENTIFIER},${DISPLAY},${GENDER},${AGE},${BIRTHDATE},${PHONE_NUMBER}`;

// patient/person's gender
export const GENDER_DICT = { M: 'Male', F: 'Female' };

export const DEFAULT_COLUMN_VALUE = '';
