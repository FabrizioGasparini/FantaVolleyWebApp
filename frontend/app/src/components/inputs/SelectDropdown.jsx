import PropTypes from 'prop-types';
import './SelectDropdown.css'


const SelectDropdown = ({ filters, onChange, filterName, optionsValues, optionsTexts }) => {
    return (
        <select className='select-dropdown' value={filters[filterName]} onChange={e => onChange(e, filterName)}>
            {optionsValues.map((value, index) => (
                <option key={index} value={value}>{optionsTexts[index]}</option>
            ))}
        </select>
    );
};

SelectDropdown.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
  optionsValues: PropTypes.array.isRequired,
  optionsTexts: PropTypes.array.isRequired,
};

export default SelectDropdown;