import dev from './dev.json';
import alpha from './alpha.json';

export const getConfig = () => {
  switch (ENV) {
    case 'development':
      return dev;
    case 'alpha':
      return alpha;
    /*	case 'local':
				return local;

			case 'prod':
				return prod;
			}*/
  }
};
