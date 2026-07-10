import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createTheme, MantineProvider, type CSSVariablesResolver } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/app/router';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({});

const cssVariablesResolver: CSSVariablesResolver = (mantineTheme) => ({
  variables: {
    '--mantine-color-dimmed': mantineTheme.colors.gray[7],
  },
  light: {
    '--mantine-color-dimmed': mantineTheme.colors.gray[7],
  },
  dark: {
    '--mantine-color-dimmed': mantineTheme.colors.gray[7],
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
