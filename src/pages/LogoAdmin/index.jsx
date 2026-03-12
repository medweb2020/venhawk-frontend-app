import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../../components/layout/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { vendorsAPI } from '../../services/api';

const normalizeSearchValue = (value) => String(value || '').toLowerCase().trim();

const getInitials = (value) => {
  const words = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return 'NA';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
};

const EmptyState = ({ title, description }) => (
  <div className="rounded-[18px] border border-dashed border-[#D7DEE6] bg-white p-6 text-center">
    <h3 className="text-[20px] font-bold text-[#2A3541]">{title}</h3>
    <p className="mt-2 text-[14px] text-[#667382]">{description}</p>
  </div>
);

const ActionButton = ({
  children,
  tone = 'primary',
  type = 'button',
  disabled = false,
  onClick,
}) => {
  const className = {
    primary: 'border-[#0E2B4C] bg-[#0E2B4C] text-white hover:bg-[#12345D]',
    secondary: 'border-[#D7DEE6] bg-white text-[#2B3641] hover:bg-[#F6F8FA]',
    danger: 'border-[#F0CCCC] bg-white text-[#A23A3A] hover:bg-[#FFF5F5]',
  }[tone];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
};

const UploadButton = ({ inputId, hasLogo, busy, onSelect, tone = 'primary' }) => {
  const baseClassName = {
    primary: 'border-[#0E2B4C] bg-[#0E2B4C] text-white hover:bg-[#12345D]',
    secondary: 'border-[#D7DEE6] bg-white text-[#2B3641] hover:bg-[#F6F8FA]',
  }[tone];

  return (
    <label htmlFor={inputId} className="cursor-pointer">
      <span
        className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${baseClassName} ${busy ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {hasLogo ? 'Replace logo' : 'Add logo'}
      </span>
      <input
        id={inputId}
        type="file"
        accept="image/*,.svg,.ico"
        className="hidden"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onSelect(file);
          }
          event.target.value = '';
        }}
      />
    </label>
  );
};

const AssetPreview = ({ src, alt, initials, size = 'medium' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClassName = {
    small: 'h-18 w-18 rounded-[20px] p-3',
    medium: 'h-32 w-32 rounded-[24px] p-5',
    large: 'h-36 w-36 rounded-[28px] p-6',
  }[size];

  if (src && !hasError) {
    return (
      <div className={`flex items-center justify-center border border-[#E6EAEE] bg-white ${sizeClassName}`}>
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center border border-dashed border-[#D5DCE3] bg-white ${sizeClassName}`}>
      <span className="text-[20px] font-bold tracking-[0.08em] text-[#5B6A79]">{initials}</span>
    </div>
  );
};

const VendorListItem = ({ vendor, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-[22px] border p-5 text-left transition-colors ${isSelected ? 'border-[#BFD0E2] bg-[#F7FAFD]' : 'border-[#E6EAEE] bg-white hover:bg-[#FAFBFC]'}`}
  >
    <div className="flex items-center gap-4">
      <AssetPreview
        src={vendor.logoUrl}
        alt={vendor.brandName}
        initials={getInitials(vendor.brandName)}
        size="small"
      />
      <p className="min-w-0 truncate text-[18px] font-bold text-[#293540]">{vendor.brandName}</p>
    </div>
  </button>
);

const ClientCard = ({ client, busy, onUploadLogo, onDeleteLogo }) => {
  const inputId = `client-logo-upload-${client.id}`;

  return (
    <article className="rounded-[24px] border border-[#E6EAEE] bg-white p-6">
      <div className="flex flex-col items-center text-center">
        <AssetPreview
          src={client.logoUrl}
          alt={client.clientName}
          initials={getInitials(client.clientName)}
          size="medium"
        />
        <h3 className="mt-5 text-[22px] font-bold leading-[1.2] text-[#334155]">
          {client.clientName}
        </h3>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <UploadButton
          inputId={inputId}
          hasLogo={Boolean(client.logoUrl)}
          busy={busy}
          onSelect={onUploadLogo}
          tone="secondary"
        />
        <ActionButton tone="danger" onClick={onDeleteLogo} disabled={busy || !client.logoUrl}>
          Remove logo
        </ActionButton>
      </div>
    </article>
  );
};

const LogoAdminPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [overview, setOverview] = useState({ vendors: [] });
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [search, setSearch] = useState('');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingVendor, setLoadingVendor] = useState(false);
  const [pageError, setPageError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const loadOverview = useCallback(async ({ preferredVendorId = null, silent = false } = {}) => {
    if (!silent) {
      setLoadingOverview(true);
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await vendorsAPI.getLogoAdminOverview(accessToken);
      const vendors = Array.isArray(response?.vendors) ? response.vendors : [];
      setOverview({ vendors });
      setPageError('');
      setSelectedVendorId((currentValue) => {
        const candidateVendorId = preferredVendorId || currentValue;
        if (candidateVendorId && vendors.some((vendor) => vendor.vendorId === candidateVendorId)) {
          return candidateVendorId;
        }
        return vendors[0]?.vendorId || '';
      });
    } catch (error) {
      setOverview({ vendors: [] });
      setSelectedVendorId('');
      if (String(error?.message || '').toLowerCase().includes('access')) {
        setPageError('You do not have access to the logo management workspace.');
      } else {
        setPageError(error.message || 'Failed to load logo management workspace.');
      }
    } finally {
      if (!silent) {
        setLoadingOverview(false);
      }
    }
  }, [getAccessTokenSilently]);

  const loadVendorDetail = useCallback(async (vendorId) => {
    if (!vendorId) {
      setSelectedVendor(null);
      return;
    }

    setLoadingVendor(true);

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await vendorsAPI.getLogoAdminVendor(vendorId, accessToken);
      setSelectedVendor(response);
      setPageError('');
    } catch (error) {
      setSelectedVendor(null);
      setPageError(error.message || 'Failed to load vendor detail.');
    } finally {
      setLoadingVendor(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (!selectedVendorId) {
      setSelectedVendor(null);
      return;
    }

    loadVendorDetail(selectedVendorId);
  }, [selectedVendorId, loadVendorDetail]);

  const filteredVendors = useMemo(() => {
    const vendors = Array.isArray(overview?.vendors) ? overview.vendors : [];
    const normalizedSearch = normalizeSearchValue(search);

    if (!normalizedSearch) {
      return vendors;
    }

    return vendors.filter((vendor) => normalizeSearchValue(vendor.brandName).includes(normalizedSearch));
  }, [overview?.vendors, search]);

  const runVendorMutation = useCallback(async (runner, successMessage) => {
    setBusy(true);
    setActionError('');
    setActionMessage('');

    try {
      const accessToken = await getAccessTokenSilently();
      const detail = await runner(accessToken);
      setSelectedVendor(detail);
      setSelectedVendorId(detail.vendorId);
      setActionMessage(successMessage);
      await loadOverview({ preferredVendorId: detail.vendorId, silent: true });
    } catch (error) {
      setActionError(error.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  }, [getAccessTokenSilently, loadOverview]);

  const handleVendorLogoUpload = async (file) => {
    await runVendorMutation(
      (accessToken) => vendorsAPI.uploadVendorLogo(selectedVendorId, file, accessToken),
      'Vendor logo updated.',
    );
  };

  const handleVendorLogoDelete = async () => {
    if (!window.confirm('Remove this vendor logo?')) {
      return;
    }

    await runVendorMutation(
      (accessToken) => vendorsAPI.deleteVendorLogo(selectedVendorId, accessToken),
      'Vendor logo removed.',
    );
  };

  const handleUploadClientLogo = async (client, file) => {
    await runVendorMutation(
      (accessToken) => vendorsAPI.uploadVendorClientLogo(selectedVendorId, client.id, file, accessToken),
      `${client.clientName} logo updated.`,
    );
  };

  const handleDeleteClientLogo = async (client) => {
    if (!window.confirm(`Remove the logo for ${client.clientName}?`)) {
      return;
    }

    await runVendorMutation(
      (accessToken) => vendorsAPI.deleteVendorClientLogo(selectedVendorId, client.id, accessToken),
      `${client.clientName} logo removed.`,
    );
  };

  if (loadingOverview) {
    return <LoadingSpinner fullScreen size="large" message="Loading logo workspace..." />;
  }

  const showRestricted = pageError === 'You do not have access to the logo management workspace.';

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-8">
        <section className="rounded-[24px] border border-[#E6EAEE] bg-white px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6A7581]">
                Admin Workspace
              </p>
              <h1 className="mt-3 text-[36px] font-bold tracking-[-0.02em] text-[#26313C] sm:text-[58px]">
                Logo Management
              </h1>
            </div>
            <div className="w-full max-w-[440px]">
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6A7581]">
                Search vendors
              </label>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by vendor name"
                className="w-full rounded-[16px] border border-[#DCE3EA] bg-[#FBFCFD] px-4 py-3 text-[15px] text-[#27313C] outline-none transition-colors placeholder:text-[#96A2AF] focus:border-[#B7C8D9]"
              />
            </div>
          </div>
        </section>

        {pageError ? (
          <div className="mt-6 rounded-[18px] border border-[#F0CCCC] bg-[#FFF6F6] px-5 py-4 text-[14px] text-[#9C3E3E]">
            {pageError}
          </div>
        ) : null}

        {!showRestricted && actionError ? (
          <div className="mt-4 rounded-[18px] border border-[#F0CCCC] bg-[#FFF6F6] px-5 py-4 text-[14px] text-[#9C3E3E]">
            {actionError}
          </div>
        ) : null}

        {!showRestricted && actionMessage ? (
          <div className="mt-4 rounded-[18px] border border-[#CFE4D4] bg-[#F2FBF5] px-5 py-4 text-[14px] text-[#23724A]">
            {actionMessage}
          </div>
        ) : null}

        {!showRestricted ? (
          <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="rounded-[24px] border border-[#E6EAEE] bg-white p-5">
              <h2 className="text-[24px] font-bold text-[#2A3541]">Vendors</h2>
              <div className="mt-5 space-y-3">
                {filteredVendors.length > 0 ? filteredVendors.map((vendor) => (
                  <VendorListItem
                    key={vendor.vendorId}
                    vendor={vendor}
                    isSelected={vendor.vendorId === selectedVendorId}
                    onClick={() => setSelectedVendorId(vendor.vendorId)}
                  />
                )) : (
                  <EmptyState
                    title="No matching vendors"
                    description="Try a different search term or clear the filter."
                  />
                )}
              </div>
            </aside>

            <div className="space-y-6">
              {loadingVendor ? (
                <div className="rounded-[24px] border border-[#E6EAEE] bg-white p-8">
                  <LoadingSpinner size="medium" message="Loading vendor detail..." />
                </div>
              ) : selectedVendor ? (
                <>
                  <section className="rounded-[24px] border border-[#E6EAEE] bg-white p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <AssetPreview
                        src={selectedVendor.logoUrl}
                        alt={selectedVendor.brandName}
                        initials={getInitials(selectedVendor.brandName)}
                        size="large"
                      />
                      <div>
                        <h2 className="text-[40px] font-bold tracking-[-0.02em] text-[#2B3641]">
                          {selectedVendor.brandName}
                        </h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <UploadButton
                            inputId="vendor-logo-upload"
                            hasLogo={Boolean(selectedVendor.logoUrl)}
                            busy={busy}
                            onSelect={handleVendorLogoUpload}
                            tone="primary"
                          />
                          <ActionButton
                            tone="danger"
                            disabled={busy || !selectedVendor.logoUrl}
                            onClick={handleVendorLogoDelete}
                          >
                            Remove logo
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-[#E6EAEE] bg-white p-6">
                    <h3 className="text-[32px] font-bold text-[#2A3541]">Clients</h3>
                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                      {selectedVendor.clients.length > 0 ? selectedVendor.clients.map((client) => (
                        <ClientCard
                          key={client.id}
                          client={client}
                          busy={busy}
                          onUploadLogo={(file) => handleUploadClientLogo(client, file)}
                          onDeleteLogo={() => handleDeleteClientLogo(client)}
                        />
                      )) : (
                        <div className="xl:col-span-2">
                          <EmptyState
                            title="No clients found"
                            description="This vendor does not have any client records to manage."
                          />
                        </div>
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <EmptyState
                  title="Choose a vendor"
                  description="Select a vendor from the left panel to manage its logo and client logos."
                />
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default LogoAdminPage;
