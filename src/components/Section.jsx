// components/Section.jsx
import PropTypes from 'prop-types';

const Section = ({ text, setText }) => {
  return (
    <div className="section">
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} // Correctly handle the change event
      /><br/>
      <button className="btn-converter">Convert to speech</button>
    </div>
  );
}

// Add PropTypes validation
Section.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired
};

export default Section;
