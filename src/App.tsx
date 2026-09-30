/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ErpProvider } from './context/ErpContext';
import { MobileShell } from './components/layout/MobileShell';

export default function App() {
  return (
    <ErpProvider>
      <MobileShell />
    </ErpProvider>
  );
}

