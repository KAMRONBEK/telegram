import { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/application/store';
import { RestyleProvider } from '@/shared/ui/restyle';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RestyleProvider>{children}</RestyleProvider>
      </PersistGate>
    </Provider>
  );
}
