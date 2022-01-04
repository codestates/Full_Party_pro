import 'react-redux';

import { AppState } from '../reducers';

declare module 'react-redux' {
  interface DefaultRootState extends AppState { };
}