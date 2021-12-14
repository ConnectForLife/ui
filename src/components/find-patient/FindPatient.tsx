import React from 'react';
import { connect } from 'react-redux';
import { reset, search } from '../../redux/reducers/patient';
import _ from 'lodash';
import { Form, FormGroup, Input, Spinner } from 'reactstrap';
import './FindPatient.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import searchIcon from '../../assets/img/search.png';
import { columnContent } from '../../shared/util/patient-util';
import { SEARCH_INPUT_DELAY, SEARCH_INPUT_MIN_CHARS } from '../../shared/constants/input';
import { helperText } from '../../shared/util/table-util';
import { PATIENT_PAGE_URL } from '../../shared/constants/openmrs';
import InfiniteTable from '../common/InfiniteTable';
import { COLUMNS_CONFIGURATION_SETTING_KEY, DEFAULT_COLUMNS } from '../../shared/constants/columns-configuration';
import { getSettingByQuery } from '../../redux/reducers/setttings';

export interface IPatientsProps extends StateProps, DispatchProps {
  intl: any;
}

export interface IPatientsState {
  query: string;
  page: number;
}

class FindPatient extends React.Component<IPatientsProps, IPatientsState> {
  state = {
    query: '',
    page: 0
  };

  searchAfterDelay = _.debounce(() => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query, this.state.page);
    }
  }, SEARCH_INPUT_DELAY);

  componentDidMount() {
    this.props.reset();
    this.props.getSettingByQuery(COLUMNS_CONFIGURATION_SETTING_KEY);
  }

  search = () => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query, this.state.page);
    }
  };

  onQueryChange = event => {
    this.setState({
      query: event.target.value,
      page: 0
    });
    this.searchAfterDelay();
  };

  onSearchClick = e => {
    e.preventDefault();
    this.searchAfterDelay.cancel();
    this.setState({
      page: 0
    });
    this.search();
  };

  switchPage = page =>
    this.setState(
      {
        page
      },
      this.search
    );

  getRecordLink = entity => `${PATIENT_PAGE_URL}?patientId=${entity.uuid}`;

  render() {
    return (
      <div className="find-patient">
        <h2>
          <FormattedMessage id="findPatient.title" />
        </h2>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.onSearchClick}>
            <FormGroup className="patient-search">
              <img src={searchIcon} alt="search" className="search-icon" />
              <Input
                id="search-patient"
                placeholder={this.props.intl.formatMessage({
                  id: 'findPatient.searchInputPlaceholder'
                })}
                value={this.state.query}
                onChange={this.onQueryChange}
                className="search-input"
              />
            </FormGroup>
          </Form>
          <div className="patient-table">
            <div className="helper-text">
              {this.props.loading ? (
                <Spinner color="dark" size="sm" />
              ) : (
                helperText(this.state.query, this.props.loading, this.props.totalCount)
              )}
            </div>
            {this.props.totalCount > 0 && (
              <InfiniteTable
                columns={this.props.tableColumns}
                entities={this.props.patients}
                columnContent={columnContent}
                hasNext={this.props.hasNext}
                currentPage={this.props.currentPage}
                switchPage={this.switchPage}
                getRecordLink={this.getRecordLink}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ cflPatient, settings: { setting } }) => ({
  patients: cflPatient.patients,
  loading: cflPatient.loading,
  error: cflPatient.errorMessage,
  hasNext: cflPatient.hasNext,
  hasPrev: cflPatient.hasPrev,
  currentPage: cflPatient.currentPage,
  totalCount: cflPatient.totalCount,
  tableColumns: JSON.parse(setting?.value || 'null') ?? DEFAULT_COLUMNS
});

const mapDispatchToProps = { search, reset, getSettingByQuery };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FindPatient));
