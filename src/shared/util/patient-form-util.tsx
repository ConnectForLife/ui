import { IFieldProps } from '../../components/register/inputs/Field';

export const getPlaceholder = (intl, label, fieldName, required) => {
  let placeholder =
    label ||
    intl.formatMessage({
      id: 'registerPatient.fields.' + fieldName
    }) ||
    fieldName;
  if (required) {
    placeholder = [
      placeholder,
      intl.formatMessage({
        id: 'registerPatient.fields.required'
      })
    ].join(' ');
  }
  return placeholder;
};

export const getCommonInputProps = (props: IFieldProps, placeholder) => {
  const { field, isInvalid, isDirty, value, onChange, patient, onPatientChange, onKeyDown } = props;
  const { name, required, type } = field;
  return {
    name,
    id: name,
    placeholder,
    value: value != null ? value : patient[name],
    onChange: onChange || setValueOnChange(patient, name, onPatientChange),
    required,
    className: 'form-control ' + (isDirty && isInvalid ? 'invalid' : ''),
    type: type || 'text',
    onKeyDown: !!onKeyDown && onKeyDown
  };
};

export const setValue = (patient, prop, callback, value) => {
  patient[prop] = value;
  callback(patient);
};

export const setValueOnChange = (patient, prop, callback) => event =>
  setValue(patient, prop, callback, event && event.target ? event.target.value : event);
