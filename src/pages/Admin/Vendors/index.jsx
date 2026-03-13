import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../../../components/layout/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { vendorsAPI } from '../../../services/api';
import {
  buildEmptyCaseStudyForm,
  buildEmptyClientForm,
  buildEmptyVendorForm,
  filterAdminProjectCategories,
  hydrateCaseStudyForm,
  hydrateClientForm,
  hydrateVendorForm,
  normalizeSearchValue,
  serializeCaseStudyPayload,
  serializeClientPayload,
  serializeVendorPayload,
  validateCaseStudyForm,
  validateClientForm,
  validateVendorForm,
} from './utils/adminWorkspace';
import { CaseStudyTable, ClientTable, VendorTable } from './components/tables';
import {
  CaseStudyEditorModal,
  ClientEditorModal,
  ConfirmActionModal,
  VendorEditorModal,
} from './components/modals';
import {
  ActionButton,
  EmptyState,
  FieldShell,
  SectionCard,
  inputClassName,
} from './components/ui';

const VendorAdminPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [overview, setOverview] = useState({
    vendors: [],
    projectCategories: [],
    fieldOptions: {
      statuses: [],
      legalFocusLevels: [],
      triStateOptions: [],
    },
  });
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [search, setSearch] = useState('');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingVendor, setLoadingVendor] = useState(false);
  const [pageError, setPageError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('edit');
  const [vendorPendingDelete, setVendorPendingDelete] = useState(null);
  const [form, setForm] = useState(buildEmptyVendorForm());
  const [formErrors, setFormErrors] = useState({});
  const [pendingVendorLogoFile, setPendingVendorLogoFile] = useState(null);
  const [pendingVendorLogoPreviewUrl, setPendingVendorLogoPreviewUrl] = useState('');
  const [pendingVendorLogoRemoval, setPendingVendorLogoRemoval] = useState(false);
  const [isClientEditorOpen, setIsClientEditorOpen] = useState(false);
  const [clientEditorMode, setClientEditorMode] = useState('create');
  const [clientEditingId, setClientEditingId] = useState(null);
  const [clientPendingDelete, setClientPendingDelete] = useState(null);
  const [clientForm, setClientForm] = useState(buildEmptyClientForm());
  const [clientFormErrors, setClientFormErrors] = useState({});
  const [pendingClientLogoFile, setPendingClientLogoFile] = useState(null);
  const [pendingClientLogoPreviewUrl, setPendingClientLogoPreviewUrl] = useState('');
  const [pendingClientLogoRemoval, setPendingClientLogoRemoval] = useState(false);
  const [isCaseStudyEditorOpen, setIsCaseStudyEditorOpen] = useState(false);
  const [caseStudyEditorMode, setCaseStudyEditorMode] = useState('create');
  const [caseStudyEditingId, setCaseStudyEditingId] = useState(null);
  const [caseStudyPendingDelete, setCaseStudyPendingDelete] = useState(null);
  const [caseStudyForm, setCaseStudyForm] = useState(buildEmptyCaseStudyForm());
  const [caseStudyFormErrors, setCaseStudyFormErrors] = useState({});

  const editorProjectCategories = useMemo(
    () => filterAdminProjectCategories(overview?.projectCategories || []),
    [overview?.projectCategories],
  );
  const editorProjectCategoryIds = useMemo(
    () => new Set(editorProjectCategories.map((category) => category.id)),
    [editorProjectCategories],
  );
  const projectCategoryLabelById = useMemo(
    () => new Map(editorProjectCategories.map((category) => [category.id, category.label])),
    [editorProjectCategories],
  );

  const resetPendingLogoState = useCallback(() => {
    setPendingVendorLogoFile(null);
    setPendingVendorLogoRemoval(false);
    setPendingVendorLogoPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return '';
    });
  }, []);

  const resetPendingClientLogoState = useCallback(() => {
    setPendingClientLogoFile(null);
    setPendingClientLogoRemoval(false);
    setPendingClientLogoPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return '';
    });
  }, []);

  useEffect(
    () => () => {
      if (pendingVendorLogoPreviewUrl) {
        URL.revokeObjectURL(pendingVendorLogoPreviewUrl);
      }
    },
    [pendingVendorLogoPreviewUrl],
  );

  useEffect(
    () => () => {
      if (pendingClientLogoPreviewUrl) {
        URL.revokeObjectURL(pendingClientLogoPreviewUrl);
      }
    },
    [pendingClientLogoPreviewUrl],
  );

  const loadOverview = useCallback(
    async ({ preferredVendorId = null, silent = false } = {}) => {
      if (!silent) {
        setLoadingOverview(true);
      }

      try {
        const accessToken = await getAccessTokenSilently();
        const response = await vendorsAPI.getVendorAdminOverview(accessToken);
        const vendors = Array.isArray(response?.vendors) ? response.vendors : [];

        setOverview({
          vendors,
          projectCategories: filterAdminProjectCategories(
            Array.isArray(response?.projectCategories) ? response.projectCategories : [],
          ),
          fieldOptions: response?.fieldOptions || {
            statuses: [],
            legalFocusLevels: [],
            triStateOptions: [],
          },
        });

        setPageError('');
        setSelectedVendorId((currentValue) => {
          const nextVendorId = preferredVendorId || currentValue;
          if (nextVendorId && vendors.some((vendor) => vendor.vendorId === nextVendorId)) {
            return nextVendorId;
          }
          return vendors[0]?.vendorId || '';
        });
      } catch (error) {
        setOverview({
          vendors: [],
          projectCategories: [],
          fieldOptions: {
            statuses: [],
            legalFocusLevels: [],
            triStateOptions: [],
          },
        });
        setSelectedVendorId('');
        if (String(error?.message || '').toLowerCase().includes('access')) {
          setPageError('You do not have access to the vendor management workspace.');
        } else {
          setPageError(error.message || 'Failed to load vendor management workspace.');
        }
      } finally {
        if (!silent) {
          setLoadingOverview(false);
        }
      }
    },
    [getAccessTokenSilently],
  );

  const loadVendorDetail = useCallback(
    async (vendorId) => {
      if (!vendorId) {
        setSelectedVendor(null);
        return;
      }

      setLoadingVendor(true);

      try {
        const accessToken = await getAccessTokenSilently();
        const response = await vendorsAPI.getVendorAdminVendor(vendorId, accessToken);
        setSelectedVendor(response);
        setPageError('');
      } catch (error) {
        setSelectedVendor(null);
        setPageError(error.message || 'Failed to load vendor detail.');
      } finally {
        setLoadingVendor(false);
      }
    },
    [getAccessTokenSilently],
  );

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

    return vendors.filter((vendor) => {
      const visibleProjectCategories = filterAdminProjectCategories(vendor.projectCategories || []);
      const searchableText = [
        vendor.brandName,
        vendor.websiteUrl,
        vendor.status,
        ...visibleProjectCategories.flatMap((category) => [category.label, category.value]),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [overview?.vendors, search]);

  const handleSelectVendor = (vendorId) => {
    setSelectedVendorId(vendorId);
    setActionError('');
    setActionMessage('');
  };

  const openCreateEditor = () => {
    setEditorMode('create');
    setForm(buildEmptyVendorForm());
    setFormErrors({});
    setActionError('');
    setActionMessage('');
    resetPendingLogoState();
    setIsEditorOpen(true);
  };

  const openEditEditor = useCallback(
    async (vendorId = selectedVendorId) => {
      if (!vendorId) {
        return;
      }

      setEditorMode('edit');
      setFormErrors({});
      setActionError('');
      setActionMessage('');
      resetPendingLogoState();

      if (selectedVendor?.vendorId === vendorId) {
        const nextForm = hydrateVendorForm(selectedVendor);
        setForm({
          ...nextForm,
          projectCategoryIds: nextForm.projectCategoryIds.filter((id) => editorProjectCategoryIds.has(id)),
        });
        setIsEditorOpen(true);
        return;
      }

      setLoadingVendor(true);

      try {
        const accessToken = await getAccessTokenSilently();
        const response = await vendorsAPI.getVendorAdminVendor(vendorId, accessToken);
        setSelectedVendor(response);
        setSelectedVendorId(response.vendorId);
        const nextForm = hydrateVendorForm(response);
        setForm({
          ...nextForm,
          projectCategoryIds: nextForm.projectCategoryIds.filter((id) => editorProjectCategoryIds.has(id)),
        });
        setIsEditorOpen(true);
      } catch (error) {
        setActionError(error.message || 'Failed to load vendor detail.');
      } finally {
        setLoadingVendor(false);
      }
    },
    [
      getAccessTokenSilently,
      editorProjectCategoryIds,
      resetPendingLogoState,
      selectedVendor,
      selectedVendorId,
    ],
  );

  const openDeleteVendor = (vendor) => {
    setVendorPendingDelete(vendor);
    setActionError('');
    setActionMessage('');
  };

  const closeEditor = useCallback(() => {
    if (busy) {
      return;
    }

    setIsEditorOpen(false);
    setFormErrors({});
    resetPendingLogoState();
  }, [busy, resetPendingLogoState]);

  const closeDeleteVendor = useCallback(() => {
    if (busy) {
      return;
    }

    setVendorPendingDelete(null);
  }, [busy]);

  const handleConfirmDeleteVendor = async () => {
    if (!vendorPendingDelete) {
      return;
    }

    const deletingVendorId = vendorPendingDelete.vendorId;
    const remainingVendors = (overview?.vendors || []).filter(
      (vendor) => vendor.vendorId !== deletingVendorId,
    );
    const nextVendorId =
      selectedVendorId === deletingVendorId ? remainingVendors[0]?.vendorId || '' : selectedVendorId;

    setBusy(true);
    setActionError('');
    setActionMessage('');

    try {
      const accessToken = await getAccessTokenSilently();
      await vendorsAPI.deleteVendorAdminVendor(deletingVendorId, accessToken);

      setVendorPendingDelete(null);
      setIsEditorOpen(false);

      if (selectedVendorId === deletingVendorId) {
        setSelectedVendor(null);
        setSelectedVendorId(nextVendorId);
      }

      await loadOverview({ preferredVendorId: nextVendorId || null, silent: true });

      if (!nextVendorId) {
        setSelectedVendor(null);
      }

      setActionMessage('Vendor deleted.');
    } catch (error) {
      setActionError(error.message || 'Failed to delete vendor.');
    } finally {
      setBusy(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));

    setFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleRatingSourceChange = (index, field, value) => {
    setForm((currentValue) => {
      const nextRatingSources = Array.isArray(currentValue.ratingSources)
        ? currentValue.ratingSources.map((ratingSource) => ({ ...ratingSource }))
        : [];

      while (nextRatingSources.length <= index) {
        nextRatingSources.push({
          sourceName: '',
          rating: '',
          reviewCount: '',
          sourceUrl: '',
        });
      }

      nextRatingSources[index] = {
        ...nextRatingSources[index],
        [field]: value,
      };

      return {
        ...currentValue,
        ratingSources: nextRatingSources,
      };
    });

    setFormErrors((currentErrors) => {
      const currentRatingSourceErrors = Array.isArray(currentErrors.ratingSources)
        ? [...currentErrors.ratingSources]
        : null;

      if (!currentRatingSourceErrors?.[index]?.[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      const nextRatingSourceErrors = [...currentRatingSourceErrors];
      const nextRowErrors = { ...nextRatingSourceErrors[index] };
      delete nextRowErrors[field];

      if (Object.keys(nextRowErrors).length > 0) {
        nextRatingSourceErrors[index] = nextRowErrors;
      } else {
        nextRatingSourceErrors[index] = undefined;
      }

      if (nextRatingSourceErrors.some(Boolean)) {
        nextErrors.ratingSources = nextRatingSourceErrors;
      } else {
        delete nextErrors.ratingSources;
      }

      return nextErrors;
    });
  };

  const handleToggleCategory = (categoryId) => {
    setForm((currentValue) => {
      const currentIds = Array.isArray(currentValue.projectCategoryIds)
        ? currentValue.projectCategoryIds
        : [];
      const nextIds = currentIds.includes(categoryId)
        ? currentIds.filter((value) => value !== categoryId)
        : [...currentIds, categoryId];

      return {
        ...currentValue,
        projectCategoryIds: nextIds,
      };
    });

    setFormErrors((currentErrors) => {
      if (!currentErrors.projectCategoryIds) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors.projectCategoryIds;
      return nextErrors;
    });
  };

  const handleSelectVendorLogoFile = (file) => {
    setPendingVendorLogoFile(file);
    setPendingVendorLogoRemoval(false);
    setPendingVendorLogoPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveVendorLogo = () => {
    setPendingVendorLogoFile(null);
    setPendingVendorLogoPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return '';
    });

    if (editorMode === 'edit' && selectedVendor?.logoUrl) {
      setPendingVendorLogoRemoval(true);
    }
  };

  const runVendorMutation = useCallback(
    async (runner, successMessage) => {
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
        return detail;
      } catch (error) {
        setActionError(error.message || 'Action failed.');
        return null;
      } finally {
        setBusy(false);
      }
    },
    [getAccessTokenSilently, loadOverview],
  );

  const handleSaveVendor = async (event) => {
    event.preventDefault();

    const nextErrors = validateVendorForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setBusy(true);
    setActionError('');
    setActionMessage('');

    try {
      const accessToken = await getAccessTokenSilently();
      const payload = serializeVendorPayload(form);

      let detail =
        editorMode === 'create'
          ? await vendorsAPI.createVendorAdminVendor(payload, accessToken)
          : await vendorsAPI.updateVendorAdminVendor(selectedVendorId, payload, accessToken);

      if (pendingVendorLogoFile) {
        detail = await vendorsAPI.uploadVendorLogo(detail.vendorId, pendingVendorLogoFile, accessToken);
      } else if (pendingVendorLogoRemoval && detail.logoUrl) {
        detail = await vendorsAPI.deleteVendorLogo(detail.vendorId, accessToken);
      }

      setSelectedVendor(detail);
      setSelectedVendorId(detail.vendorId);
      setActionMessage(editorMode === 'create' ? 'Vendor created.' : 'Vendor updated.');
      setIsEditorOpen(false);
      setFormErrors({});
      resetPendingLogoState();
      await loadOverview({ preferredVendorId: detail.vendorId, silent: true });
    } catch (error) {
      setActionError(error.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const openCreateClientEditor = () => {
    setClientEditorMode('create');
    setClientEditingId(null);
    setClientForm(buildEmptyClientForm());
    setClientFormErrors({});
    setActionError('');
    setActionMessage('');
    resetPendingClientLogoState();
    setIsClientEditorOpen(true);
  };

  const openEditClientEditor = (client) => {
    setClientEditorMode('edit');
    setClientEditingId(client.id);
    setClientForm(hydrateClientForm(client));
    setClientFormErrors({});
    setActionError('');
    setActionMessage('');
    resetPendingClientLogoState();
    setIsClientEditorOpen(true);
  };

  const closeClientEditor = useCallback(() => {
    if (busy) {
      return;
    }

    setIsClientEditorOpen(false);
    setClientFormErrors({});
    resetPendingClientLogoState();
  }, [busy, resetPendingClientLogoState]);

  const handleClientFieldChange = (field, value) => {
    setClientForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));

    setClientFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSelectClientLogoFile = (file) => {
    setPendingClientLogoFile(file);
    setPendingClientLogoRemoval(false);
    setPendingClientLogoPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveClientLogo = () => {
    setPendingClientLogoFile(null);
    setPendingClientLogoPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return '';
    });

    if (
      clientEditorMode === 'edit' &&
      selectedVendor?.clients?.some((client) => client.id === clientEditingId && client.logoUrl)
    ) {
      setPendingClientLogoRemoval(true);
    }
  };

  const handleSaveClient = async (event) => {
    event.preventDefault();

    const nextErrors = validateClientForm(clientForm);
    if (Object.keys(nextErrors).length > 0) {
      setClientFormErrors(nextErrors);
      return;
    }

    setBusy(true);
    setActionError('');
    setActionMessage('');

    try {
      const accessToken = await getAccessTokenSilently();
      const payload = serializeClientPayload(clientForm);

      let detail =
        clientEditorMode === 'create'
          ? await vendorsAPI.createVendorAdminClient(selectedVendorId, payload, accessToken)
          : await vendorsAPI.updateVendorAdminClient(
              selectedVendorId,
              clientEditingId,
              payload,
              accessToken,
            );

      const persistedClientName = payload.clientName.toLowerCase();
      const persistedClient = detail.clients.find(
        (client) => String(client.clientName || '').trim().toLowerCase() === persistedClientName,
      );

      if (!persistedClient) {
        throw new Error('Client was saved but could not be reloaded.');
      }

      if (pendingClientLogoFile) {
        detail = await vendorsAPI.uploadVendorClientLogo(
          selectedVendorId,
          persistedClient.id,
          pendingClientLogoFile,
          accessToken,
        );
      } else if (pendingClientLogoRemoval && persistedClient.logoUrl) {
        detail = await vendorsAPI.deleteVendorClientLogo(
          selectedVendorId,
          persistedClient.id,
          accessToken,
        );
      }

      setSelectedVendor(detail);
      setActionMessage(clientEditorMode === 'create' ? 'Client created.' : 'Client updated.');
      setIsClientEditorOpen(false);
      setClientFormErrors({});
      resetPendingClientLogoState();
    } catch (error) {
      setActionError(error.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const openDeleteClient = (client) => {
    setClientPendingDelete(client);
    setActionError('');
    setActionMessage('');
  };

  const closeDeleteClient = useCallback(() => {
    if (busy) {
      return;
    }

    setClientPendingDelete(null);
  }, [busy]);

  const handleConfirmDeleteClient = async () => {
    if (!clientPendingDelete) {
      return;
    }

    const detail = await runVendorMutation(
      (accessToken) => vendorsAPI.deleteVendorAdminClient(selectedVendorId, clientPendingDelete.id, accessToken),
      'Client deleted.',
    );

    if (detail) {
      setClientPendingDelete(null);
    }
  };

  const openCreateCaseStudyEditor = () => {
    setCaseStudyEditorMode('create');
    setCaseStudyEditingId(null);
    setCaseStudyForm(buildEmptyCaseStudyForm());
    setCaseStudyFormErrors({});
    setActionError('');
    setActionMessage('');
    setIsCaseStudyEditorOpen(true);
  };

  const openEditCaseStudyEditor = (caseStudy) => {
    setCaseStudyEditorMode('edit');
    setCaseStudyEditingId(caseStudy.id);
    setCaseStudyForm(hydrateCaseStudyForm(caseStudy));
    setCaseStudyFormErrors({});
    setActionError('');
    setActionMessage('');
    setIsCaseStudyEditorOpen(true);
  };

  const closeCaseStudyEditor = useCallback(() => {
    if (busy) {
      return;
    }

    setIsCaseStudyEditorOpen(false);
    setCaseStudyFormErrors({});
  }, [busy]);

  const handleCaseStudyFieldChange = (field, value) => {
    setCaseStudyForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));

    setCaseStudyFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSaveCaseStudy = async (event) => {
    event.preventDefault();

    const nextErrors = validateCaseStudyForm(caseStudyForm);
    if (Object.keys(nextErrors).length > 0) {
      setCaseStudyFormErrors(nextErrors);
      return;
    }

    setBusy(true);
    setActionError('');
    setActionMessage('');

    try {
      const accessToken = await getAccessTokenSilently();
      const payload = serializeCaseStudyPayload(caseStudyForm);
      const detail =
        caseStudyEditorMode === 'create'
          ? await vendorsAPI.createVendorAdminCaseStudy(selectedVendorId, payload, accessToken)
          : await vendorsAPI.updateVendorAdminCaseStudy(
              selectedVendorId,
              caseStudyEditingId,
              payload,
              accessToken,
            );

      setSelectedVendor(detail);
      setActionMessage(caseStudyEditorMode === 'create' ? 'Case study created.' : 'Case study updated.');
      setIsCaseStudyEditorOpen(false);
      setCaseStudyFormErrors({});
    } catch (error) {
      setActionError(error.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const openDeleteCaseStudy = (caseStudy) => {
    setCaseStudyPendingDelete(caseStudy);
    setActionError('');
    setActionMessage('');
  };

  const closeDeleteCaseStudy = useCallback(() => {
    if (busy) {
      return;
    }

    setCaseStudyPendingDelete(null);
  }, [busy]);

  const handleConfirmDeleteCaseStudy = async () => {
    if (!caseStudyPendingDelete) {
      return;
    }

    const detail = await runVendorMutation(
      (accessToken) =>
        vendorsAPI.deleteVendorAdminCaseStudy(selectedVendorId, caseStudyPendingDelete.id, accessToken),
      'Case study deleted.',
    );

    if (detail) {
      setCaseStudyPendingDelete(null);
    }
  };

  if (loadingOverview) {
    return <LoadingSpinner fullScreen size="large" message="Loading vendor management..." />;
  }

  const showRestricted = pageError === 'You do not have access to the vendor management workspace.';
  const fieldOptions = overview?.fieldOptions || {
    statuses: [],
    legalFocusLevels: [],
    triStateOptions: [],
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <Header />

      <div className="mx-auto max-w-[1680px] px-4 pb-10 pt-6 sm:px-8">
        <section className="rounded-[24px] border border-[#E6EAEE] bg-white px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6A7581]">
            Admin Workspace
          </p>
          <h1 className="mt-3 text-[36px] font-bold tracking-[-0.02em] text-[#26313C] sm:text-[56px]">
            Vendor Management
          </h1>
          <p className="mt-3 max-w-[820px] text-[15px] leading-8 text-[#667382]">
            Manage vendors, clients, case studies, and logos from one admin surface. Creation and
            editing stay modal-based so the directory remains compact even as vendor content grows.
          </p>
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
          <div className="mt-6 space-y-6">
            <SectionCard
              title="Vendor Directory"
              description="Search, scan, and open the vendor editor only when needed."
              aside={<ActionButton onClick={openCreateEditor}>New vendor</ActionButton>}
            >
              <div className="mb-5 max-w-[420px]">
                <FieldShell label="Search">
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by vendor, category, or status"
                    className={inputClassName(false)}
                  />
                </FieldShell>
              </div>

              <VendorTable
                vendors={filteredVendors}
                selectedVendorId={selectedVendorId}
                onSelectVendor={handleSelectVendor}
                onEditVendor={openEditEditor}
                onDeleteVendor={openDeleteVendor}
              />
            </SectionCard>

            {loadingVendor ? (
              <div className="rounded-[24px] border border-[#E6EAEE] bg-white p-8">
                <LoadingSpinner size="medium" message="Loading vendor..." />
              </div>
            ) : selectedVendor ? (
              <div className="space-y-6">
                <SectionCard
                  title={`Clients · ${selectedVendor.brandName}`}
                  description="Maintain named clients and their logos for the selected vendor."
                  aside={<ActionButton onClick={openCreateClientEditor}>Add client</ActionButton>}
                >
                  <ClientTable
                    clients={selectedVendor.clients || []}
                    projectCategoryLabelById={projectCategoryLabelById}
                    onEdit={openEditClientEditor}
                    onDelete={openDeleteClient}
                  />
                </SectionCard>

                <SectionCard
                  title={`Case Studies · ${selectedVendor.brandName}`}
                  description="Maintain the published case-study set used across vendor detail pages."
                  aside={<ActionButton onClick={openCreateCaseStudyEditor}>Add case study</ActionButton>}
                >
                  <CaseStudyTable
                    caseStudies={selectedVendor.caseStudies || []}
                    projectCategoryLabelById={projectCategoryLabelById}
                    onEdit={openEditCaseStudyEditor}
                    onDelete={openDeleteCaseStudy}
                  />
                </SectionCard>
              </div>
            ) : (
              <EmptyState
                title="Choose a vendor"
                description="Select a vendor from the directory or create a new one to start editing."
              />
            )}
          </div>
        ) : null}
      </div>

      <VendorEditorModal
        isOpen={isEditorOpen}
        mode={editorMode}
        form={form}
        errors={formErrors}
        busy={busy}
        fieldOptions={fieldOptions}
        projectCategories={editorProjectCategories}
        currentLogoUrl={editorMode === 'edit' ? selectedVendor?.logoUrl || null : null}
        logoPreviewUrl={pendingVendorLogoPreviewUrl}
        logoFile={pendingVendorLogoFile}
        pendingLogoRemoval={pendingVendorLogoRemoval}
        onClose={closeEditor}
        onSubmit={handleSaveVendor}
        onFieldChange={handleFieldChange}
        onRatingSourceChange={handleRatingSourceChange}
        onToggleCategory={handleToggleCategory}
        onSelectLogoFile={handleSelectVendorLogoFile}
        onRemoveLogo={handleRemoveVendorLogo}
      />
      <ClientEditorModal
        isOpen={isClientEditorOpen}
        mode={clientEditorMode}
        form={clientForm}
        errors={clientFormErrors}
        busy={busy}
        projectCategories={editorProjectCategories}
        currentLogoUrl={
          clientEditorMode === 'edit'
            ? selectedVendor?.clients?.find((client) => client.id === clientEditingId)?.logoUrl || null
            : null
        }
        logoPreviewUrl={pendingClientLogoPreviewUrl}
        logoFile={pendingClientLogoFile}
        pendingLogoRemoval={pendingClientLogoRemoval}
        onClose={closeClientEditor}
        onSubmit={handleSaveClient}
        onFieldChange={handleClientFieldChange}
        onSelectLogoFile={handleSelectClientLogoFile}
        onRemoveLogo={handleRemoveClientLogo}
      />
      <CaseStudyEditorModal
        isOpen={isCaseStudyEditorOpen}
        mode={caseStudyEditorMode}
        form={caseStudyForm}
        errors={caseStudyFormErrors}
        busy={busy}
        projectCategories={editorProjectCategories}
        onClose={closeCaseStudyEditor}
        onSubmit={handleSaveCaseStudy}
        onFieldChange={handleCaseStudyFieldChange}
      />
      <ConfirmActionModal
        isOpen={Boolean(vendorPendingDelete)}
        title="Delete Vendor"
        message={
          vendorPendingDelete
            ? `This will permanently delete ${vendorPendingDelete.brandName}, its category mappings, client rows, case studies, reviews, and any managed vendor or client logos.`
            : ''
        }
        busy={busy}
        confirmLabel="Delete vendor"
        onClose={closeDeleteVendor}
        onConfirm={handleConfirmDeleteVendor}
      />
      <ConfirmActionModal
        isOpen={Boolean(clientPendingDelete)}
        title="Delete Client"
        message={
          clientPendingDelete
            ? `This will permanently delete ${clientPendingDelete.clientName} and its managed logo if one exists.`
            : ''
        }
        busy={busy}
        confirmLabel="Delete client"
        onClose={closeDeleteClient}
        onConfirm={handleConfirmDeleteClient}
      />
      <ConfirmActionModal
        isOpen={Boolean(caseStudyPendingDelete)}
        title="Delete Case Study"
        message={
          caseStudyPendingDelete
            ? `This will permanently delete the case study "${caseStudyPendingDelete.title}".`
            : ''
        }
        busy={busy}
        confirmLabel="Delete case study"
        onClose={closeDeleteCaseStudy}
        onConfirm={handleConfirmDeleteCaseStudy}
      />
    </div>
  );
};

export default VendorAdminPage;
