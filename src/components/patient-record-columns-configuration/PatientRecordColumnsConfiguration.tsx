import React, { useCallback, useEffect, useState } from 'react';
import ColumnRow from './ColumnRow';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Button, Spinner } from 'reactstrap';
import { uniqWith, isEqual, cloneDeep } from 'lodash';
import { setAllPossibleColumns, setColumnsConfiguration } from '../../redux/reducers/columns-configuration';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { IRegistrationStep } from '../../shared/models/registration-steps';
import {
  ADJACENT_LOWER_AND_UPPER_LETTERS_REGEX,
  COLUMNS_CONFIGURATION_SETTING_KEY,
  FIRST_COLUMN_NAME_LETTERS_REGEX,
  FIXED_COLUMNS,
  RETURN_LOCATION
} from '../../shared/constants/columns-configuration';
import { IColumnConfiguration } from '../../shared/models/columns-configuration';
import { EMPTY_STRING } from '../../shared/constants/input';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import '../Inputs.scss';
import './PatientRecordColumnsConfiguration.scss';

interface IStore {
  apps: {
    loading: boolean;
    patientRegistrationSteps: IRegistrationStep[];
  };
  patientRecordColumnsConfiguration: {
    columnsConfiguration: IColumnConfiguration[];
  };
  settings: {
    success: boolean;
    isSettingExist: { value: boolean };
    setting: {
      uuid: string;
      value: string;
    } | null;
  };
}

interface IPatientRecordColumnsConfigurationProps extends StateProps, DispatchProps {
  intl: IntlShape;
}

const PatientRecordColumnsConfiguration = ({
  intl: { formatMessage },
  isAppLoading,
  patientRegistrationSteps,
  columnsConfiguration,
  isSettingExist,
  settingUuid,
  settingValue,
  settingsSaved,
  setAllPossibleColumns,
  setColumnsConfiguration,
  getSettingByQuery,
  createSetting,
  updateSetting
}: IPatientRecordColumnsConfigurationProps) => {
  useEffect(() => {
    getSettingByQuery(COLUMNS_CONFIGURATION_SETTING_KEY);
  }, [getSettingByQuery]);
  useEffect(() => {
    settingValue && setColumnsConfiguration(JSON.parse(settingValue));
  }, [setColumnsConfiguration, settingValue]);
  useEffect(() => {
    settingsSaved && successToast(formatMessage({ id: 'patientRecordColumnsConfiguration.configurationSaved' }));
  }, [formatMessage, settingsSaved]);
  useEffect(() => {
    if (patientRegistrationSteps) {
      const columns = [...FIXED_COLUMNS];

      patientRegistrationSteps.map(({ fields }) =>
        fields.forEach(({ name: fieldName }) => {
          if (fieldName) {
            const capitalizedFirstColumnNameLetter = fieldName.replace(
              FIRST_COLUMN_NAME_LETTERS_REGEX,
              str => str.charAt(0).toUpperCase() + str.substr(1)
            );
            const name = capitalizedFirstColumnNameLetter.replace(ADJACENT_LOWER_AND_UPPER_LETTERS_REGEX, '$1 $2');

            columns.push({ label: name, value: fieldName });
          }
        })
      );

      setAllPossibleColumns(uniqWith(columns, isEqual));
    }
  }, [patientRegistrationSteps, setAllPossibleColumns]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onReturnHandler = useCallback(() => (window.location.href = RETURN_LOCATION), []);
  const onSaveHandler = useCallback(() => setIsModalOpen(true), []);
  const markConfigurationAsInvalid = useCallback(() => {
    const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);

    clonedColumnsConfiguration[0].isValid = false;

    errorToast(formatMessage({ id: 'patientRecordColumnsConfiguration.configurationNotSaved' }));
    setColumnsConfiguration(clonedColumnsConfiguration);
    setIsModalOpen(false);
  }, [columnsConfiguration, formatMessage, setColumnsConfiguration]);
  const onNoHandler = useCallback(() => setIsModalOpen(false), []);
  const onYesHandler = useCallback(() => {
    const omittedEmptyColumnsConfiguration = columnsConfiguration.filter(({ value }) => value);

    if (!omittedEmptyColumnsConfiguration.length) {
      return markConfigurationAsInvalid();
    }

    const config = omittedEmptyColumnsConfiguration.map(column => ({ label: column.label, value: column.value }));
    const configJson = JSON.stringify(config);

    if (isSettingExist) {
      updateSetting({ uuid: settingUuid, value: configJson });
    } else {
      createSetting(COLUMNS_CONFIGURATION_SETTING_KEY, configJson);
    }

    setIsModalOpen(false);
  }, [columnsConfiguration, createSetting, isSettingExist, settingUuid, updateSetting, markConfigurationAsInvalid]);

  return (
    <div id="patient-record-columns-configuration" data-testid="patientRecordcolumnsConfiguration">
      <ConfirmationModal
        header={{ id: 'patientRecordColumnsConfiguration.modal.header' }}
        body={{ id: 'patientRecordColumnsConfiguration.modal.body' }}
        onYes={onYesHandler}
        onNo={onNoHandler}
        isOpen={isModalOpen}
      />
      <div className="title">
        <FormattedMessage id="patientRecordColumnsConfiguration.title" tagName="h2" />
      </div>
      {isAppLoading ? (
        <div className="spinner" data-testid="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="section">
            <div className="title">
              <FormattedMessage id="patientRecordColumnsConfiguration.configureColumns" tagName="h4" />
            </div>
            <div className="columns">
              {columnsConfiguration.map((column, idx) => (
                <ColumnRow key={`${column.value}-${idx}`} column={column} columnIdx={idx} />
              ))}
            </div>
          </div>
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={onReturnHandler} data-testid="returnButton">
                <FormattedMessage id="common.return" />
              </Button>
            </div>
            <div className="d-inline pull-right confirm-button-container">
              <Button className="save" onClick={onSaveHandler} data-testid="saveButton">
                <FormattedMessage id="common.save" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  apps: { loading: isAppLoading, patientRegistrationSteps },
  patientRecordColumnsConfiguration: { columnsConfiguration },
  settings: {
    success: settingsSaved,
    isSettingExist: { value: isSettingExist },
    setting
  }
}: IStore) => ({
  isAppLoading,
  settingsSaved,
  patientRegistrationSteps,
  columnsConfiguration,
  isSettingExist,
  settingUuid: setting?.uuid ?? EMPTY_STRING,
  settingValue: setting?.value ?? EMPTY_STRING
});

const mapDispatchToProps = {
  setAllPossibleColumns,
  setColumnsConfiguration,
  getSettingByQuery,
  createSetting,
  updateSetting
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PatientRecordColumnsConfiguration));
