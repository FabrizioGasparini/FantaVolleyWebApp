import PropTypes from 'prop-types';
import './TextInput.css'


const TextInput = ({ filters, onChange, filterName }) => {
    return (
        <input className='text-input' type="text" name={filterName} id={filterName} value={filters[filterName]} placeholder='Nome Giocatore' onChange={e => onChange(e, filterName)} />
    );
};

TextInput.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired
};

export default TextInput;