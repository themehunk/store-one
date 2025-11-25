// src/admin/index.jsx
import { createRoot } from '@wordpress/element';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('store-one-admin-app');

    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
});
