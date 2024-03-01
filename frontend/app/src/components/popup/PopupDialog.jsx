import PropTypes from "prop-types";
import './PopupDialog.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function PopupDialog(props) {
  const [trigger, setTrigger] = useState(props.trigger);

  // Aggiorna il valore di trigger quando props.trigger cambia
  useEffect(() => {
    setTrigger(props.trigger);
  }, [props.trigger]);

  return trigger ? (
    <div className="popup-dialog">
      <div className="popup-content">
              <button className="close-btn" onClick={() => {
                setTrigger(false)
                props.onClose()
              }}>
          <FontAwesomeIcon icon={faX} />
        </button>
        <h2 className="header">{props.title}</h2>
        {props.children}
      </div>
    </div>
  ) : null;
}

PopupDialog.propTypes = {
    trigger: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired
};

export default PopupDialog;