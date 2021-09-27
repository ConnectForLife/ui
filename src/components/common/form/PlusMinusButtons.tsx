import React from 'react';
import Plus from '../../../assets/img/plus.png';
import Minus from '../../../assets/img/minus.png';

export function PlusMinusButtons({ intl, onPlusClick, onMinusClick, isPlusButtonVisible = true }) {
  return (
    <div className="align-items-center justify-content-center d-flex action-icons">
      <div className="action-icons-inner">
        <img
          src={Minus}
          title={intl.formatMessage({ id: 'vmpConfig.delete' })}
          alt="remove"
          className="remove-item"
          onClick={onMinusClick}
        />
        {isPlusButtonVisible && (
          <img
            src={Plus}
            title={intl.formatMessage({ id: 'vmpConfig.addNew' })}
            alt="add"
            className="mx-2 add-item"
            onClick={onPlusClick}
          />
        )}
      </div>
    </div>
  );
}
