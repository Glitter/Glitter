import '@fortawesome/fontawesome-svg-core/styles.css';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faShieldAlt,
  faCog,
  faWindowRestore,
  faCode,
  faCheckCircle,
  faInfoCircle,
  faExclamationCircle,
  faMinusCircle,
  faSave,
} from '@fortawesome/pro-duotone-svg-icons';
import {
  faEllipsisV as fasEllipsisV,
  faPlusSquare as fasPlusSquare,
} from '@fortawesome/pro-solid-svg-icons';
import { faReact, faVuejs } from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;

library.add(
  faShieldAlt,
  faCog,
  faWindowRestore,
  faCode,
  faCheckCircle,
  faInfoCircle,
  faExclamationCircle,
  faMinusCircle,
  faSave,
  fasPlusSquare,
  fasEllipsisV,
  faReact,
  faVuejs,
);
