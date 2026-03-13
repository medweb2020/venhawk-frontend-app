import { getInitials } from '../utils/adminWorkspace';
import {
  ActionButton,
  AssetPreview,
  CategorySelector,
  FieldShell,
  ModalShell,
  OptionalCategorySelect,
  ToggleCard,
  UploadButton,
  inputClassName,
} from './ui';

export const ConfirmActionModal = ({
  isOpen,
  title,
  message,
  busy,
  confirmLabel,
  onClose,
  onConfirm,
}) => (
  <ModalShell isOpen={isOpen} onClose={onClose} title={title} description="">
    <div className="space-y-6">
      <div className="rounded-[22px] border border-[#F0CCCC] bg-[#FFF6F6] p-5">
        <p className="text-[15px] leading-7 text-[#8D3A3A]">{message}</p>
      </div>

      <p className="text-[14px] text-[#667382]">
        This action cannot be undone. Confirm only if you want to remove the record permanently.
      </p>

      <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEF2F5] pt-6">
        <ActionButton tone="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </ActionButton>
        <ActionButton tone="danger" onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </ActionButton>
      </div>
    </div>
  </ModalShell>
);

export const VendorEditorModal = ({
  isOpen,
  mode,
  form,
  errors,
  busy,
  fieldOptions,
  projectCategories,
  currentLogoUrl,
  logoPreviewUrl,
  logoFile,
  pendingLogoRemoval,
  onClose,
  onSubmit,
  onFieldChange,
  onRatingSourceChange,
  onToggleCategory,
  onSelectLogoFile,
  onRemoveLogo,
}) => (
  <ModalShell
    isOpen={isOpen}
    onClose={onClose}
    title={mode === 'create' ? 'Create Vendor' : 'Edit Vendor'}
    description="Edit the vendor profile and commit logo changes in the same save."
  >
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[24px] border border-[#E6EAEE] bg-[#FBFCFD] p-5">
          <h3 className="text-[18px] font-bold text-[#27313C]">Vendor Logo</h3>
          <div className="mt-5 flex flex-col items-center text-center">
            <AssetPreview
              src={pendingLogoRemoval ? null : logoPreviewUrl || currentLogoUrl || null}
              alt={form.brandName || 'Vendor'}
              initials={getInitials(form.brandName)}
              size="large"
            />
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <UploadButton
                inputId="vendor-editor-logo-upload"
                hasLogo={Boolean(logoPreviewUrl || currentLogoUrl) && !pendingLogoRemoval}
                busy={busy}
                onSelect={onSelectLogoFile}
                tone="primary"
              />
              <ActionButton
                tone="danger"
                disabled={busy || (!currentLogoUrl && !logoFile)}
                onClick={onRemoveLogo}
              >
                Remove logo
              </ActionButton>
            </div>
            {logoFile ? (
              <p className="mt-4 text-[13px] text-[#23724A]">New logo selected: {logoFile.name}</p>
            ) : null}
            {pendingLogoRemoval ? (
              <p className="mt-4 text-[13px] text-[#A23A3A]">Logo will be removed when you save.</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-[18px] font-bold text-[#27313C]">Core</h3>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              <FieldShell label="Brand Name" required error={errors.brandName}>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(event) => onFieldChange('brandName', event.target.value)}
                  className={inputClassName(Boolean(errors.brandName))}
                  placeholder="Vendor brand name"
                />
              </FieldShell>

              <FieldShell label="Website URL" required error={errors.websiteUrl}>
                <input
                  type="text"
                  value={form.websiteUrl}
                  onChange={(event) => onFieldChange('websiteUrl', event.target.value)}
                  className={inputClassName(Boolean(errors.websiteUrl))}
                  placeholder="https://vendor.com"
                />
              </FieldShell>

              <FieldShell label="Status" required>
                <select
                  value={form.status}
                  onChange={(event) => onFieldChange('status', event.target.value)}
                  className={inputClassName(false)}
                >
                  {fieldOptions.statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Last Verified Date" required error={errors.lastVerifiedDate}>
                <input
                  type="date"
                  value={form.lastVerifiedDate}
                  onChange={(event) => onFieldChange('lastVerifiedDate', event.target.value)}
                  className={inputClassName(Boolean(errors.lastVerifiedDate))}
                />
              </FieldShell>

              <FieldShell label="Vendor Type">
                <input
                  type="text"
                  value={form.vendorType}
                  onChange={(event) => onFieldChange('vendorType', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="Consulting, SI, MSP"
                />
              </FieldShell>

              <FieldShell label="Listing Tier">
                <input
                  type="text"
                  value={form.listingTier}
                  onChange={(event) => onFieldChange('listingTier', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="Tier 1, Tier 2, Tier 3"
                />
              </FieldShell>

              <div className="xl:col-span-2">
                <CategorySelector
                  options={projectCategories}
                  selectedValues={form.projectCategoryIds}
                  onToggle={onToggleCategory}
                  error={errors.projectCategoryIds}
                />
              </div>

              <FieldShell label="HQ Country">
                <input
                  type="text"
                  value={form.hqCountry}
                  onChange={(event) => onFieldChange('hqCountry', event.target.value)}
                  className={inputClassName(false)}
                />
              </FieldShell>

              <FieldShell label="HQ State / Region">
                <input
                  type="text"
                  value={form.hqState}
                  onChange={(event) => onFieldChange('hqState', event.target.value)}
                  className={inputClassName(false)}
                />
              </FieldShell>
            </div>
          </div>

          <div>
            <h3 className="text-[18px] font-bold text-[#27313C]">Matching Signals</h3>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              <FieldShell label="Listing Specialty">
                <input
                  type="text"
                  value={form.listingSpecialty}
                  onChange={(event) => onFieldChange('listingSpecialty', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="Primary specialty"
                />
              </FieldShell>

              <FieldShell label="Legal Tech Stack">
                <input
                  type="text"
                  value={form.legalTechStack}
                  onChange={(event) => onFieldChange('legalTechStack', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="iManage, Intapp, NetDocuments"
                />
              </FieldShell>

              <FieldShell label="Service Domains">
                <textarea
                  rows={4}
                  value={form.serviceDomains}
                  onChange={(event) => onFieldChange('serviceDomains', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="Comma-separated service domains"
                />
              </FieldShell>

              <FieldShell label="Platforms Experience">
                <textarea
                  rows={4}
                  value={form.platformsExperience}
                  onChange={(event) => onFieldChange('platformsExperience', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="Cloud, ERP, analytics, CRM platforms"
                />
              </FieldShell>

              <div className="xl:col-span-2">
                <FieldShell label="Listing Description">
                  <textarea
                    rows={4}
                    value={form.listingDescription}
                    onChange={(event) => onFieldChange('listingDescription', event.target.value)}
                    className={inputClassName(false)}
                    placeholder="Short listing description used publicly"
                  />
                </FieldShell>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[18px] font-bold text-[#27313C]">Qualification</h3>
            <div className="mt-4 grid gap-5 xl:grid-cols-3">
              <FieldShell label="Legal Focus Level">
                <select
                  value={form.legalFocusLevel}
                  onChange={(event) => onFieldChange('legalFocusLevel', event.target.value)}
                  className={inputClassName(false)}
                >
                  {fieldOptions.legalFocusLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Reference Availability">
                <select
                  value={form.referenceAvailable}
                  onChange={(event) => onFieldChange('referenceAvailable', event.target.value)}
                  className={inputClassName(false)}
                >
                  {fieldOptions.triStateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Legal Reference Availability">
                <select
                  value={form.legalReferencesAvailable}
                  onChange={(event) => onFieldChange('legalReferencesAvailable', event.target.value)}
                  className={inputClassName(false)}
                >
                  {fieldOptions.triStateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="SOC 2">
                <select
                  value={form.hasSoc2}
                  onChange={(event) => onFieldChange('hasSoc2', event.target.value)}
                  className={inputClassName(false)}
                >
                  {fieldOptions.triStateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="ISO 27001">
                <select
                  value={form.hasIso27001}
                  onChange={(event) => onFieldChange('hasIso27001', event.target.value)}
                  className={inputClassName(false)}
                >
                  {fieldOptions.triStateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Lead Time (Weeks)">
                <input
                  type="number"
                  min="0"
                  value={form.leadTimeWeeks}
                  onChange={(event) => onFieldChange('leadTimeWeeks', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="e.g. 4"
                />
              </FieldShell>

              <FieldShell label="Minimum Project Size (USD)">
                <input
                  type="number"
                  min="0"
                  value={form.minProjectSizeUsd}
                  onChange={(event) => onFieldChange('minProjectSizeUsd', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="e.g. 50000"
                />
              </FieldShell>

              <FieldShell label="Maximum Project Size (USD)">
                <input
                  type="number"
                  min="0"
                  value={form.maxProjectSizeUsd}
                  onChange={(event) => onFieldChange('maxProjectSizeUsd', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="e.g. 250000"
                />
              </FieldShell>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ToggleCard
                label="Microsoft Partner"
                value={form.isMicrosoftPartner}
                onClick={() => onFieldChange('isMicrosoftPartner', !form.isMicrosoftPartner)}
              />
              <ToggleCard
                label="ServiceNow Partner"
                value={form.isServicenowPartner}
                onClick={() => onFieldChange('isServicenowPartner', !form.isServicenowPartner)}
              />
              <ToggleCard
                label="Workday Partner"
                value={form.isWorkdayPartner}
                onClick={() => onFieldChange('isWorkdayPartner', !form.isWorkdayPartner)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#27313C]">Ratings & Sources</h3>
                <p className="mt-1 text-[14px] leading-6 text-[#667382]">
                  Add up to two public rating sources. Leave a source block empty if you do not want
                  to use it.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              {(Array.isArray(form.ratingSources) ? form.ratingSources : []).map(
                (ratingSource, index) => {
                  const rowErrors =
                    Array.isArray(errors.ratingSources) && errors.ratingSources[index]
                      ? errors.ratingSources[index]
                      : {};

                  return (
                    <div
                      key={`vendor-rating-source-${index}`}
                      className="rounded-[24px] border border-[#E6EAEE] bg-[#FBFCFD] p-5"
                    >
                      <h4 className="text-[16px] font-semibold text-[#27313C]">
                        Rating Source {index + 1}
                      </h4>
                      <div className="mt-4 grid gap-4">
                        <FieldShell label="Source Name" error={rowErrors.sourceName}>
                          <input
                            type="text"
                            value={ratingSource.sourceName}
                            onChange={(event) =>
                              onRatingSourceChange(index, 'sourceName', event.target.value)
                            }
                            className={inputClassName(Boolean(rowErrors.sourceName))}
                            placeholder="G2, Clutch, Gartner Peer Insights"
                          />
                        </FieldShell>

                        <div className="grid gap-4 md:grid-cols-2">
                          <FieldShell label="Rating" error={rowErrors.rating}>
                            <input
                              type="number"
                              min="0.1"
                              max="5"
                              step="0.1"
                              value={ratingSource.rating}
                              onChange={(event) =>
                                onRatingSourceChange(index, 'rating', event.target.value)
                              }
                              className={inputClassName(Boolean(rowErrors.rating))}
                              placeholder="4.7"
                            />
                          </FieldShell>

                          <FieldShell label="Review Count" error={rowErrors.reviewCount}>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={ratingSource.reviewCount}
                              onChange={(event) =>
                                onRatingSourceChange(index, 'reviewCount', event.target.value)
                              }
                              className={inputClassName(Boolean(rowErrors.reviewCount))}
                              placeholder="126"
                            />
                          </FieldShell>
                        </div>

                        <FieldShell label="Source URL" error={rowErrors.sourceUrl}>
                          <input
                            type="text"
                            value={ratingSource.sourceUrl}
                            onChange={(event) =>
                              onRatingSourceChange(index, 'sourceUrl', event.target.value)
                            }
                            className={inputClassName(Boolean(rowErrors.sourceUrl))}
                            placeholder="https://..."
                          />
                        </FieldShell>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEF2F5] pt-6">
            <ActionButton tone="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" disabled={busy}>
              {mode === 'create' ? 'Create vendor' : 'Save changes'}
            </ActionButton>
          </div>
        </div>
      </div>
    </form>
  </ModalShell>
);

export const ClientEditorModal = ({
  isOpen,
  mode,
  form,
  errors,
  busy,
  projectCategories,
  currentLogoUrl,
  logoPreviewUrl,
  logoFile,
  pendingLogoRemoval,
  onClose,
  onSubmit,
  onFieldChange,
  onSelectLogoFile,
  onRemoveLogo,
}) => (
  <ModalShell
    isOpen={isOpen}
    onClose={onClose}
    title={mode === 'create' ? 'Add Client' : 'Edit Client'}
    description="Maintain the client record and its logo in one save flow."
  >
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[24px] border border-[#E6EAEE] bg-[#FBFCFD] p-5">
          <h3 className="text-[18px] font-bold text-[#27313C]">Client Logo</h3>
          <div className="mt-5 flex flex-col items-center text-center">
            <AssetPreview
              src={pendingLogoRemoval ? null : logoPreviewUrl || currentLogoUrl || null}
              alt={form.clientName || 'Client'}
              initials={getInitials(form.clientName)}
              size="large"
            />
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <UploadButton
                inputId="client-editor-logo-upload"
                hasLogo={Boolean(logoPreviewUrl || currentLogoUrl) && !pendingLogoRemoval}
                busy={busy}
                onSelect={onSelectLogoFile}
              />
              <ActionButton
                tone="danger"
                disabled={busy || (!currentLogoUrl && !logoFile)}
                onClick={onRemoveLogo}
              >
                Remove logo
              </ActionButton>
            </div>
            {logoFile ? (
              <p className="mt-4 text-[13px] text-[#23724A]">New logo selected: {logoFile.name}</p>
            ) : null}
            {pendingLogoRemoval ? (
              <p className="mt-4 text-[13px] text-[#A23A3A]">Logo will be removed when you save.</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-5 xl:grid-cols-2">
            <FieldShell label="Client Name" required error={errors.clientName}>
              <input
                type="text"
                value={form.clientName}
                onChange={(event) => onFieldChange('clientName', event.target.value)}
                className={inputClassName(Boolean(errors.clientName))}
                placeholder="Client name"
              />
            </FieldShell>

            <FieldShell label="Project Category">
              <OptionalCategorySelect
                value={form.projectCategoryId}
                options={projectCategories}
                onChange={(value) => onFieldChange('projectCategoryId', value)}
              />
            </FieldShell>

            <FieldShell label="Client Website">
              <input
                type="text"
                value={form.clientWebsiteUrl}
                onChange={(event) => onFieldChange('clientWebsiteUrl', event.target.value)}
                className={inputClassName(false)}
                placeholder="https://client.com"
              />
            </FieldShell>

            <FieldShell label="Source Name">
              <input
                type="text"
                value={form.sourceName}
                onChange={(event) => onFieldChange('sourceName', event.target.value)}
                className={inputClassName(false)}
                placeholder="Official vendor page"
              />
            </FieldShell>

            <div className="xl:col-span-2">
              <FieldShell label="Source URL">
                <input
                  type="text"
                  value={form.sourceUrl}
                  onChange={(event) => onFieldChange('sourceUrl', event.target.value)}
                  className={inputClassName(false)}
                  placeholder="https://source.com/client-story"
                />
              </FieldShell>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEF2F5] pt-6">
            <ActionButton tone="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" disabled={busy}>
              {mode === 'create' ? 'Create client' : 'Save client'}
            </ActionButton>
          </div>
        </div>
      </div>
    </form>
  </ModalShell>
);

export const CaseStudyEditorModal = ({
  isOpen,
  mode,
  form,
  errors,
  busy,
  projectCategories,
  onClose,
  onSubmit,
  onFieldChange,
}) => (
  <ModalShell
    isOpen={isOpen}
    onClose={onClose}
    title={mode === 'create' ? 'Add Case Study' : 'Edit Case Study'}
    description="Keep case-study metadata, summary, and source links current."
  >
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-2">
        <FieldShell label="Title" required error={errors.title}>
          <input
            type="text"
            value={form.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            className={inputClassName(Boolean(errors.title))}
            placeholder="Case study title"
          />
        </FieldShell>

        <FieldShell label="Project Category">
          <OptionalCategorySelect
            value={form.projectCategoryId}
            options={projectCategories}
            onChange={(value) => onFieldChange('projectCategoryId', value)}
          />
        </FieldShell>

        <div className="xl:col-span-2">
          <FieldShell label="Summary" required error={errors.summary}>
            <textarea
              rows={5}
              value={form.summary}
              onChange={(event) => onFieldChange('summary', event.target.value)}
              className={inputClassName(Boolean(errors.summary))}
              placeholder="Two to three lines describing the work and outcome."
            />
          </FieldShell>
        </div>

        <FieldShell label="Study URL">
          <input
            type="text"
            value={form.studyUrl}
            onChange={(event) => onFieldChange('studyUrl', event.target.value)}
            className={inputClassName(false)}
            placeholder="https://vendor.com/case-study"
          />
        </FieldShell>

        <FieldShell label="Source Name">
          <input
            type="text"
            value={form.sourceName}
            onChange={(event) => onFieldChange('sourceName', event.target.value)}
            className={inputClassName(false)}
            placeholder="Official vendor page"
          />
        </FieldShell>

        <div className="xl:col-span-2">
          <FieldShell label="Source URL">
            <input
              type="text"
              value={form.sourceUrl}
              onChange={(event) => onFieldChange('sourceUrl', event.target.value)}
              className={inputClassName(false)}
              placeholder="https://source.com/case-study"
            />
          </FieldShell>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEF2F5] pt-6">
        <ActionButton tone="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" disabled={busy}>
          {mode === 'create' ? 'Create case study' : 'Save case study'}
        </ActionButton>
      </div>
    </form>
  </ModalShell>
);
