import { filterAdminProjectCategories, getInitials } from '../utils/adminWorkspace';
import { ActionButton, AdminLink, AssetPreview, EmptyState, StatusBadge } from './ui';

export const VendorTable = ({
  vendors,
  selectedVendorId,
  onSelectVendor,
  onEditVendor,
  onDeleteVendor,
}) => {
  if (!vendors.length) {
    return (
      <EmptyState
        title="No matching vendors"
        description="Try a different search term or create a new vendor."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E6EAEE]">
      <div className="max-h-[440px] overflow-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="sticky top-0 z-10 bg-[#F8FAFC] shadow-[inset_0_-1px_0_0_#E6EAEE]">
            <tr className="border-b border-[#E6EAEE]">
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Vendor
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Categories
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Website
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Status
              </th>
              <th className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => {
              const isSelected = vendor.vendorId === selectedVendorId;
              const visibleProjectCategories = filterAdminProjectCategories(
                vendor.projectCategories || [],
              );

              return (
                <tr
                  key={vendor.vendorId}
                  onClick={() => onSelectVendor(vendor.vendorId)}
                  className={`cursor-pointer border-b border-[#EEF2F5] transition-colors last:border-b-0 ${
                    isSelected ? 'bg-[#F2F7FC]' : 'hover:bg-[#FAFBFC]'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <AssetPreview
                        src={vendor.logoUrl}
                        alt={vendor.brandName}
                        initials={getInitials(vendor.brandName)}
                        size="small"
                      />
                      <span className="text-[16px] font-semibold text-[#27313C]">
                        {vendor.brandName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {visibleProjectCategories.length ? (
                        visibleProjectCategories.slice(0, 2).map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex rounded-full bg-[#F3F6F8] px-3 py-1 text-[11px] font-semibold text-[#5D6A77]"
                          >
                            {category.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] text-[#8A96A3]">None</span>
                      )}
                      {visibleProjectCategories.length > 2 ? (
                        <span className="inline-flex rounded-full bg-[#F3F6F8] px-3 py-1 text-[11px] font-semibold text-[#5D6A77]">
                          +{visibleProjectCategories.length - 2}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="max-w-[340px] px-5 py-4 text-[14px] text-[#667382]">
                    <span className="block truncate">{vendor.websiteUrl}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={vendor.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        tone="secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditVendor(vendor.vendorId);
                        }}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        tone="danger"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteVendor(vendor);
                        }}
                      >
                        Delete
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ClientTable = ({ clients, projectCategoryLabelById, onEdit, onDelete }) => {
  if (!clients.length) {
    return (
      <EmptyState
        title="No clients found"
        description="Add the first named client for this vendor."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E6EAEE]">
      <div className="max-h-[360px] overflow-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="sticky top-0 z-10 bg-[#F8FAFC] shadow-[inset_0_-1px_0_0_#E6EAEE]">
            <tr className="border-b border-[#E6EAEE]">
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Client
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Category
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Website
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Source
              </th>
              <th className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-[#EEF2F5] last:border-b-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <AssetPreview
                      src={client.logoUrl}
                      alt={client.clientName}
                      initials={getInitials(client.clientName)}
                      size="small"
                    />
                    <div>
                      <p className="text-[15px] font-semibold text-[#27313C]">
                        {client.clientName}
                      </p>
                      <p className="mt-1 text-[12px] text-[#7A8794]">
                        {client.logoUrl ? 'Logo set' : 'No logo'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[14px] text-[#667382]">
                  {projectCategoryLabelById.get(client.projectCategoryId) || 'All categories'}
                </td>
                <td className="px-5 py-4">
                  <AdminLink href={client.clientWebsiteUrl}>Open</AdminLink>
                </td>
                <td className="px-5 py-4">
                  <AdminLink href={client.sourceUrl}>{client.sourceName || 'Source'}</AdminLink>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <ActionButton tone="secondary" onClick={() => onEdit(client)}>
                      Edit
                    </ActionButton>
                    <ActionButton tone="danger" onClick={() => onDelete(client)}>
                      Delete
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CaseStudyTable = ({
  caseStudies,
  projectCategoryLabelById,
  onEdit,
  onDelete,
}) => {
  if (!caseStudies.length) {
    return (
      <EmptyState
        title="No case studies found"
        description="Add the first case study for this vendor."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E6EAEE]">
      <div className="max-h-[360px] overflow-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="sticky top-0 z-10 bg-[#F8FAFC] shadow-[inset_0_-1px_0_0_#E6EAEE]">
            <tr className="border-b border-[#E6EAEE]">
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Case Study
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Category
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Study URL
              </th>
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Source
              </th>
              <th className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-[0.08em] text-[#677483]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.map((caseStudy) => (
              <tr key={caseStudy.id} className="border-b border-[#EEF2F5] last:border-b-0">
                <td className="px-5 py-4">
                  <div className="max-w-[520px]">
                    <p className="text-[15px] font-semibold text-[#27313C]">{caseStudy.title}</p>
                    <p className="mt-1 text-[13px] leading-6 text-[#667382]">
                      {caseStudy.summary}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 text-[14px] text-[#667382]">
                  {projectCategoryLabelById.get(caseStudy.projectCategoryId) || 'All categories'}
                </td>
                <td className="px-5 py-4">
                  <AdminLink href={caseStudy.studyUrl}>Open</AdminLink>
                </td>
                <td className="px-5 py-4">
                  <AdminLink href={caseStudy.sourceUrl}>
                    {caseStudy.sourceName || 'Source'}
                  </AdminLink>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <ActionButton tone="secondary" onClick={() => onEdit(caseStudy)}>
                      Edit
                    </ActionButton>
                    <ActionButton tone="danger" onClick={() => onDelete(caseStudy)}>
                      Delete
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
