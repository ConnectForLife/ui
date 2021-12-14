import React, { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './Location.scss';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import '../Inputs.scss';
import { Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { InputWithPlaceholder, RadioButtonsWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import { getLocationAttributeTypes, searchLocations, saveLocation, ILocationState, getLocation } from '../../redux/reducers/location';
import { chunk } from 'lodash';
import { ILocation, ILocationAttributeType } from '../../shared/models/location';
import { STRING_FALSE, STRING_TRUE } from '../../shared/constants/input';
import { TextareaWithPlaceholder } from '../common/textarea/Textarea';
import ValidationError from '../common/form/ValidationError';
import { scrollToTop } from '../../shared/util/window-util';
import cx from 'classnames';
import _ from 'lodash';

export interface ILocationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: IntlShape;
}

interface IUrlParams {
  locationId: string;
}

interface IOption {
  label: string;
  value: string;
}

const DEFAULT_LOCATION: ILocation = {
  name: '',
  description: '',
  address1: '',
  address2: '',
  cityVillage: '',
  stateProvince: '',
  country: '',
  postalCode: '',
  tags: [],
  attributes: []
};
const COLUMNS = 2;
const DROPDOWN_HANDLER_CONFIG_SEPARATOR = ',';
const BOOLEAN_RADIOS_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.BooleanFieldGenDatatypeHandler';
const DROPDOWN_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.SpecifiedTextOptionsDropdownHandler';
const TEXTAREA_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.LongFreeTextTextareaHandler';

export const Location = (props: ILocationProps) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const {
    intl: { formatMessage }
  } = props;
  const { locationId } = props.match.params as IUrlParams;

  useEffect(() => {
    props.getLocationAttributeTypes();
    props.searchLocations();
    if (locationId) {
      props.getLocation(locationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.editedLocation) {
      setLocation(props.editedLocation);
    }
  }, [props.editedLocation]);

  const onReturn = () => {
    window.location.href = `${ROOT_URL}adminui/metadata/locations/manageLocations.page`;
  };

  const onSave = () => {
    if (isLocationNameEmpty || isLocationNameDuplicated || isCountryEmpty) {
      setShowValidationErrors(true);
      scrollToTop();
    } else {
      const preparedLocation = _.cloneDeep(location) as ILocation;
      preparedLocation.attributes = preparedLocation.attributes
        .filter(attribute => attribute.value !== '')
        .map(({ attributeType, value }) => ({ attributeType, value }));
      props.saveLocation(preparedLocation);
    }
  };

  useEffect(() => {
    if (props.success) {
      onReturn();
    }
  }, [props.success]);

  const onValueChange = (name: string) => (event: ChangeEvent) => setLocation({ ...location, [name]: extractEventValue(event) });

  const onAttributeValueChange = (uuid: string) => (event: ChangeEvent | string) => {
    let attributes = location.attributes;
    const attribute = attributes.find(attribute => attribute.attributeType.uuid === uuid);
    const value = extractEventValue(event);

    if (attribute) {
      attribute.value = value;
    } else {
      attributes = [...location.attributes, { attributeType: { uuid }, value }];
    }

    setLocation({ ...location, attributes });
  };

  const isLocationNameEmpty = !location.name;

  const isLocationNameDuplicated = props.locations
    .filter(loc => loc.uuid !== location.uuid)
    .map(loc => loc.display.toLowerCase())
    .includes(location.name.toLowerCase());

  const isCountryEmpty = !location.country;

  const locationAttributeTypesGrouped: Array<Array<ILocationAttributeType>> = chunk(props.locationAttributeTypes, COLUMNS);

  const input = (locationAttributeType: ILocationAttributeType) => {
    const key = `locationAttribute${locationAttributeType.uuid}`;
    const placeholder = locationAttributeType.name;
    const value = location.attributes.find(attribute => locationAttributeType.uuid === attribute.attributeType.uuid)?.value;
    const onChange = onAttributeValueChange(locationAttributeType.uuid);

    switch (locationAttributeType.preferredHandlerClassname) {
      case DROPDOWN_PREFERRED_HANDLER:
        const options: Array<IOption> = locationAttributeType.handlerConfig
          .split(DROPDOWN_HANDLER_CONFIG_SEPARATOR)
          .map(value => ({ label: value, value }));
        return (
          <SelectWithPlaceholder
            key={key}
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={options.find(option => option.value === value)}
            onChange={(option: IOption) => onChange(option.value)}
            options={options}
            wrapperClassName="flex-1"
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
          />
        );
      case BOOLEAN_RADIOS_PREFERRED_HANDLER:
        return (
          <RadioButtonsWithPlaceholder
            key={key}
            name={key}
            onChange={onChange}
            options={[
              { value: STRING_TRUE, label: formatMessage({ id: 'common.true' }) },
              { value: STRING_FALSE, label: formatMessage({ id: 'common.false' }) }
            ]}
            value={value?.toString()}
            placeholder={placeholder}
            showPlaceholder
          />
        );
      case TEXTAREA_PREFERRED_HANDLER:
        return (
          <TextareaWithPlaceholder
            key={key}
            placeholder={placeholder}
            showPlaceholder={!!value}
            value={value}
            onChange={onChange}
            isResizable
          />
        );
      default:
        return <InputWithPlaceholder key={key} placeholder={placeholder} showPlaceholder={!!value} value={value} onChange={onChange} />;
    }
  };

  return (
    <div id="location">
      <h2>
        <FormattedMessage id={`locations.location.${locationId ? 'edit' : 'create'}.title`} />
      </h2>
      <div className="inner-content">
        {props.loadingLocationAttributeTypes || props.loadingLocation ? (
          <div className="spinner">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="section">
              <div className="inline-fields">
                <div className="input-container">
                  <InputWithPlaceholder
                    key="locationNameInput"
                    placeholder={formatMessage({ id: 'locations.location.name' })}
                    showPlaceholder={!!location.name}
                    value={location.name}
                    onChange={onValueChange('name')}
                    className={cx({ invalid: showValidationErrors && (isLocationNameEmpty || isLocationNameDuplicated) })}
                    data-testid="locationNameInput"
                  />
                  {showValidationErrors &&
                    (isLocationNameEmpty ? (
                      <ValidationError message="locations.location.error.required" />
                    ) : (
                      isLocationNameDuplicated && <ValidationError message="locations.location.error.nameUnique" />
                    ))}
                </div>
                <InputWithPlaceholder
                  key="locationDescriptionInput"
                  placeholder={formatMessage({ id: 'locations.location.description' })}
                  showPlaceholder={!!location.description}
                  value={location.description}
                  onChange={onValueChange('description')}
                  data-testid="locationDescriptionInput"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationAddress1Input"
                  placeholder={formatMessage({ id: 'locations.location.address1' })}
                  showPlaceholder={!!location.address1}
                  value={location.address1}
                  onChange={onValueChange('address1')}
                  data-testid="locationAddress1Input"
                />
                <InputWithPlaceholder
                  key="locationAddress2Input"
                  placeholder={formatMessage({ id: 'locations.location.address2' })}
                  showPlaceholder={!!location.address2}
                  value={location.address2}
                  onChange={onValueChange('address2')}
                  data-testid="locationAddress2Input"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationCityVillageInput"
                  placeholder={formatMessage({ id: 'locations.location.cityVillage' })}
                  showPlaceholder={!!location.cityVillage}
                  value={location.cityVillage}
                  onChange={onValueChange('cityVillage')}
                  data-testid="locationCityVillageInput"
                />
                <InputWithPlaceholder
                  key="locationStateProvinceInput"
                  placeholder={formatMessage({ id: 'locations.location.stateProvince' })}
                  showPlaceholder={!!location.stateProvince}
                  value={location.stateProvince}
                  onChange={onValueChange('stateProvince')}
                  data-testid="locationStateProvinceInput"
                />
              </div>
              <div className="inline-fields">
                <InputWithPlaceholder
                  key="locationPostalCodeInput"
                  placeholder={formatMessage({ id: 'locations.location.postalCode' })}
                  showPlaceholder={!!location.postalCode}
                  value={location.postalCode}
                  onChange={onValueChange('postalCode')}
                  data-testid="locationPostalCodeInput"
                />
                <div className="input-container">
                  <InputWithPlaceholder
                    key="locationCountryInput"
                    placeholder={formatMessage({ id: 'locations.location.country' })}
                    showPlaceholder={!!location.country}
                    value={location.country}
                    onChange={onValueChange('country')}
                    className={cx({ invalid: showValidationErrors && isCountryEmpty })}
                    data-testid="locationCountryInput"
                  />
                  {showValidationErrors && isCountryEmpty && <ValidationError message="locations.location.error.required" />}
                </div>
              </div>
              {locationAttributeTypesGrouped?.map((locationAttributeTypesGroup, idx) => (
                <div className="inline-fields" key={`locationAttributeTypesGroup${idx}`}>
                  {locationAttributeTypesGroup.map(locationAttributeType => input(locationAttributeType))}
                </div>
              ))}
            </div>
            <div className="mt-5 pb-5">
              <div className="d-inline">
                <Button className="cancel" onClick={onReturn} data-testid="returnButton">
                  <FormattedMessage id="common.return" />
                </Button>
              </div>
              <div className="d-inline pull-right confirm-button-container">
                <Button className="save" onClick={onSave} data-testid="saveButton">
                  <FormattedMessage id="common.save" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const location: ILocationState = state.location;
  return {
    loadingLocationAttributeTypes: location.loadingLocationAttributeTypes,
    locationAttributeTypes: location.locationAttributeTypes.filter(locationAttributeType => !locationAttributeType.retired),
    locations: location.locations,
    success: location.success,
    loadingLocation: location.loadingLocation,
    editedLocation: location.location
  };
};

const mapDispatchToProps = { getLocationAttributeTypes, searchLocations, saveLocation, getLocation };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Location)));
