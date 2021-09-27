export interface IPatient {
  givenName: string;
  middleName: string;
  familyName: string;
  preferred: boolean;
  gender: string;
  unknown: boolean;
  birthdate?: any;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  personLanguage: string;
  phoneNumber: number;
  locationId: string;
  // 'Aadhar Number' in the request
  aadharNumber: number;
  // 'ART Number' in the request
  artNumber: number;
  relationship_type: string;
  other_person_uuid: string;
  birthdateYears: number;
  birthdateMonths: number;
  patientId?: number;
  personId?: number;
  uuid?: string;
  // custom
  relatives?: any[];
}
