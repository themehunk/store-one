// src/admin/App.js
import { useState, useEffect } from '@wordpress/element';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Flex,
    FlexBlock,
    FlexItem,
    ToggleControl,
    Notice,
    Spinner,
    TabPanel,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import './admin.scss';

const modulesList = [
    {
        id: 'woo-search',
        label: 'Woo Search',
        description: 'Boost product discovery with advanced AJAX search.',
        icon: '🔍',
    },
    {
        id: 'cart',
        label: 'Smart Cart',
        description: 'Elegant AJAX mini cart with smart checkout tools.',
        icon: '🛒',
    },
    {
        id: 'frequently-bought',
        label: 'Frequently Bought',
        description: 'AI-powered product combo suggestions.',
        icon: '🤝',
    },
];

const tabs = [
    {
        name: 'all',
        title: 'All Modules',
        modules: ['woo-search', 'cart', 'frequently-bought'],
    },
    {
        name: 'recommended',
        title: 'Recommended',
        modules: ['woo-search', 'cart'],
    },
    {
        name: 'trending',
        title: 'Trending',
        modules: ['frequently-bought'],
    },
];

const App = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // main nav: "dashboard" / "settings"
    const [currentPage, setCurrentPage] = useState('dashboard');
    // which module settings are open
    const [activeModule, setActiveModule] = useState(null);

    const [modulesState, setModulesState] = useState({
        'woo-search': true,
        cart: true,
        'frequently-bought': true,
    });

    const currentModule = activeModule
        ? modulesList.find((m) => m.id === activeModule)
        : null;

    useEffect(() => {
        if (!window.StoreOneAdmin) {
            setError('Configuration missing.');
            setLoading(false);
            return;
        }

        apiFetch.use(apiFetch.createNonceMiddleware(StoreOneAdmin.nonce));
        apiFetch({ path: `${StoreOneAdmin.restUrl}settings` })
            .then((res) => {
                if (res?.settings?.modules) {
                    const newState = {};
                    modulesList.forEach((mod) => {
                        newState[mod.id] = !!res.settings.modules[mod.id]?.enabled;
                    });
                    setModulesState(newState);
                }
            })
            .catch(() => setError('Failed to load settings.'))
            .finally(() => setLoading(false));
    }, []);

    const saveSettings = () => {
        setSaving(true);
        setError('');
        setSuccess('');

        const payload = { settings: { modules: {} } };

        modulesList.forEach((mod) => {
            payload.settings.modules[mod.id] = {
                enabled: !!modulesState[mod.id],
            };
        });

        apiFetch({
            path: `${StoreOneAdmin.restUrl}settings`,
            method: 'POST',
            data: payload,
        })
            .then(() => setSuccess('Saved successfully!'))
            .catch(() => setError('Failed to save settings.'))
            .finally(() => setSaving(false));
    };

    return (
        <div className="store-one-admin">
            {/* HEADER */}
            <header className="store-one-header">
                <div className="store-one-header-left">
                    <span className="store-one-logo">S1</span>
                    <div>
                        <h1 className="store-one-title">Store One</h1>
                        <p className="store-one-subtitle">
                            WooCommerce Enhancement Toolkit
                        </p>
                    </div>
                </div>

                {/* CENTER NAV BUTTONS */}
                <nav className="store-one-header-nav">
                    <button
                        className={`nav-btn ${
                            currentPage === 'dashboard' ? 'is-active' : ''
                        }`}
                        onClick={() => {
                            setCurrentPage('dashboard');
                            setActiveModule(null); // show modules grid
                        }}
                    >
                        Dashboard
                    </button>

                    <button
                        className={`nav-btn ${
                            currentPage === 'settings' ? 'is-active' : ''
                        }`}
                        onClick={() => {
                            setCurrentPage('settings');
                            setActiveModule(null); // no module detail here
                        }}
                    >
                        Settings
                    </button>
                </nav>

                <a
                    href="#"
                    className="components-button is-secondary upgrade-btn"
                >
                    Upgrade
                </a>
            </header>

            {/* GLOBAL NOTICES */}
            {/* {error && (
                <Notice
                    status="error"
                    isDismissible
                    onRemove={() => setError('')}
                >
                    {error}
                </Notice>
            )} */}
            {success && (
                <Notice
                    status="success"
                    isDismissible
                    onRemove={() => setSuccess('')}
                >
                    {success}
                </Notice>
            )}

            {/* DASHBOARD PAGE */}
            {currentPage === 'dashboard' && (
                <>
                    <h2 className="page-title">
                        Get started fast with pre-built modules.
                    </h2>

                    {loading && (
                        <div className="loading">
                            <Spinner /> Loading…
                        </div>
                    )}

                    {/* 1) Dashboard → Modules grid */}
                    {!loading && !activeModule && (
                        <div className="modules-wrapper">
                            <TabPanel
                                className="module-tabs"
                                tabs={tabs}
                            >
                                {(tab) => (
                                    <div className="modules-grid">
                                        {modulesList
                                            .filter((m) =>
                                                tab.modules.includes(m.id)
                                            )
                                            .map((mod) => (
                                                <Card
                                                    key={mod.id}
                                                    className="module-card"
                                                >
                                                    <CardBody>
                                                        <div className="mod-top">
                                                            <span className="mod-icon">
                                                                {mod.icon}
                                                            </span>
                                                            <span
                                                                className={`badge ${
                                                                    modulesState[
                                                                        mod.id
                                                                    ]
                                                                        ? 'on'
                                                                        : 'off'
                                                                }`}
                                                            >
                                                                {modulesState[
                                                                    mod.id
                                                                ]
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </span>
                                                        </div>

                                                        <h3>{mod.label}</h3>
                                                        <p>
                                                            {mod.description}
                                                        </p>

                                                        <Button
                                                            className="try-now"
                                                            isPrimary
                                                            onClick={() =>
                                                                setActiveModule(
                                                                    mod.id
                                                                )
                                                            }
                                                        >
                                                            Try now →
                                                        </Button>
                                                    </CardBody>
                                                </Card>
                                            ))}
                                    </div>
                                )}
                            </TabPanel>
                        </div>
                    )}

                    {/* 2) Dashboard → Single module settings + preview */}
                    {!loading && activeModule && currentModule && (
                        <div className="settings-page">
                            <Button
                                isTertiary
                                className="back-btn"
                                onClick={() => setActiveModule(null)}
                            >
                                ← Go Back
                            </Button>

                            <div className="settings-grid">
                                {/* LEFT: Settings */}
                                <Card className="settings-card">
                                    <CardHeader>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                        >
                                            <FlexBlock>
                                                <h2 className="settings-title">
                                                    {currentModule.label}
                                                </h2>
                                                <p className="settings-desc">
                                                    {
                                                        currentModule.description
                                                    }
                                                </p>
                                            </FlexBlock>
                                            <FlexItem>
                                                <ToggleControl
                                                    label={
                                                        modulesState[
                                                            currentModule.id
                                                        ]
                                                            ? 'Enabled'
                                                            : 'Disabled'
                                                    }
                                                    checked={
                                                        modulesState[
                                                            currentModule.id
                                                        ]
                                                    }
                                                    onChange={(val) =>
                                                        setModulesState(
                                                            (prev) => ({
                                                                ...prev,
                                                                [
                                                                    currentModule
                                                                        .id
                                                                ]: val,
                                                            })
                                                        )
                                                    }
                                                />
                                            </FlexItem>
                                        </Flex>
                                    </CardHeader>

                                    <CardBody>
                                        <p>
                                            More settings will appear here…
                                            (options, layout, design, etc.)
                                        </p>

                                        <Button
                                            isPrimary
                                            disabled={saving}
                                            onClick={saveSettings}
                                            className="save-btn"
                                        >
                                            {saving
                                                ? 'Saving…'
                                                : 'Save Settings'}
                                        </Button>
                                    </CardBody>
                                </Card>

                                {/* RIGHT: Preview */}
                                <Card className="preview-card">
                                    <CardHeader>
                                        <h3 className="preview-title">
                                            Preview
                                        </h3>
                                    </CardHeader>

                                    <CardBody>
                                        <div className="preview-box">
                                            <div className="preview-browser-bar">
                                                <span className="dot" />
                                                <span className="dot" />
                                                <span className="dot" />
                                            </div>

                                            <div className="preview-content">
                                                <div className="preview-thumb" />
                                                <div className="preview-line lg" />
                                                <div className="preview-line" />
                                                <div className="preview-line" />

                                                <div className="preview-highlight-text">
                                                    Ships on November 26, 2025.
                                                </div>

                                                <Button
                                                    isSecondary
                                                    className="preview-btn"
                                                >
                                                    Pre Order Now!
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* SETTINGS PAGE (GLOBAL PLUGIN SETTINGS) */}
            {currentPage === 'settings' && (
                <div className="settings-page">
                    <h2 className="page-title">Global Settings</h2>

                    <Card className="settings-card">
                        <CardHeader>
                            <h3>Plugin Status</h3>
                        </CardHeader>
                        <CardBody>
                            <ToggleControl
                                label="Enable all modules (master switch)"
                                checked={Object.values(modulesState).every(
                                    Boolean
                                )}
                                onChange={(enableAll) => {
                                    const updated = {};
                                    modulesList.forEach((mod) => {
                                        updated[mod.id] = enableAll;
                                    });
                                    setModulesState(updated);
                                }}
                            />

                            <p style={{ marginTop: '12px' }}>
                                This switch quickly turns all modules on or off.
                                Individual module controls are still available
                                in the Dashboard.
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="settings-card" style={{ marginTop: 16 }}>
                        <CardHeader>
                            <h3>Support & Documentation</h3>
                        </CardHeader>
                        <CardBody>
                            <p>
                                Need help? Visit documentation or contact
                                support.
                            </p>
                            <Button
                                isSecondary
                                href="#"
                                style={{ marginRight: '8px' }}
                            >
                                View Docs
                            </Button>
                            <Button isSecondary href="#">
                                Contact Support
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default App;
