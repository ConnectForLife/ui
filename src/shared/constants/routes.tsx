import Condition from '../../components/conditions/Condition';
import FindPatient from '../../components/find-patient/FindPatient';
import { PRIVILEGES } from './privilege';
import FindCaregiver from '../../components/find-caregiver/FindCaregiver';
import RegisterPatient from '../../components/register/RegisterPatient';
import RegisterCaregiver from '../../components/register/RegisterCaregiver';
import Dashboard from '../../components/dashboard/Dashboard';
import Conditions from '../../components/conditions/Conditions';
import VmpConfig from '../../components/vmp-config/VmpConfig';
import VmpVaccinationSchedule from '../../components/vmp-vaccination-schedule/VmpVaccinationSchedule';
import AddressData from '../../components/address-data/AddressData';
import VmpTranslations from '../../components/vmp-translations/VmpTranslations';
import NotificationConfiguration from '../../components/notification-configuration/NotificationConfiguration';
import NotificationTemplates from '../../components/notification-templates/NotificationTemplates';
import Location from '../../components/locations/Location';
import UserAccount from '../../components/user-account/UserAccount';
import ManageRegimens from '../../components/manage-regimens/ManageRegimens';
import FindPatientColumnsConfiguration from '../../components/find-patient-columns-configuration/FindPatientColumnsConfiguration';

export const routeConfig = [
  {
    path: '/patient-record-columns-configuration',
    component: FindPatientColumnsConfiguration,
    breadcrumb: 'findPatientColumnsConfiguration.title'
  },
  {
    path: '/regimens',
    component: ManageRegimens,
    breadcrumb: 'manageRegimens.title'
  },
  {
    path: '/locations/edit-location/:locationId',
    component: Location,
    breadcrumb: 'locations.location.edit.title'
  },
  {
    path: '/locations/create-location',
    component: Location,
    breadcrumb: 'locations.location.create.title'
  },
  {
    path: '/user-account',
    component: UserAccount,
    breadcrumb: 'userAccount.title'
  },
  {
    path: '/conditions/:patientUuid/manage',
    component: Condition,
    breadcrumb: 'manageCondition.title'
  },
  {
    path: '/conditions/:patientUuid',
    component: Conditions,
    breadcrumb: 'conditions.title'
  },
  {
    path: '/vmp-config',
    component: VmpConfig,
    breadcrumb: 'vmpConfig.title'
  },
  {
    path: '/vmp-vaccination-schedule',
    component: VmpVaccinationSchedule,
    breadcrumb: 'vmpVaccinationSchedule.title'
  },
  {
    path: '/address-data',
    component: AddressData,
    breadcrumb: 'addressData.title'
  },
  {
    path: '/vmp-translations',
    component: VmpTranslations,
    breadcrumb: 'vmpTranslations.title'
  },
  {
    path: '/notification-configuration',
    component: NotificationConfiguration,
    breadcrumb: 'notificationConfiguration.title'
  },
  {
    path: '/notification-templates',
    component: NotificationTemplates,
    breadcrumb: 'notificationTemplates.title'
  },
  {
    path: '/find-patient',
    component: FindPatient,
    breadcrumb: 'findPatient.title',
    requiredPrivilege: PRIVILEGES.GET_PATIENTS
  },
  {
    path: '/find-caregiver',
    component: FindCaregiver,
    breadcrumb: 'findCaregiver.title',
    requiredPrivilege: PRIVILEGES.GET_PEOPLE
  },
  {
    path: '/register-patient',
    component: RegisterPatient,
    breadcrumb: 'registerPatient.title',
    requiredPrivilege: PRIVILEGES.ADD_PATIENTS
  },
  {
    path: '/edit-patient/:id',
    component: RegisterPatient,
    breadcrumb: 'editPatient.title',
    requiredPrivilege: PRIVILEGES.EDIT_PATIENTS
  },
  {
    path: '/register-caregiver',
    component: RegisterCaregiver,
    breadcrumb: 'registerCaregiver.title',
    requiredPrivilege: PRIVILEGES.ADD_PATIENTS
  },
  {
    path: '/edit-caregiver/:id',
    component: RegisterCaregiver,
    breadcrumb: 'editCaregiver.title',
    requiredPrivilege: PRIVILEGES.EDIT_PATIENTS
  },
  {
    path: '/',
    component: Dashboard,
    breadcrumb: 'home.title'
  }
];
