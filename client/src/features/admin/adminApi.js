/**
 * @deprecated
 * adminApi has been split into domain-specific files under
 * @/modules/admin/api/
 *
 * This file re-exports everything for backward compatibility.
 * Migrate imports to the new locations when convenient:
 *   - @/modules/admin/api/adminProductsApi
 *   - @/modules/admin/api/adminOrdersApi
 *   - @/modules/admin/api/adminCategoriesApi
 *   - @/modules/admin/api/adminBrandsApi
 *   - @/modules/admin/api/adminUsersApi
 *   - @/modules/admin/api/adminReviewsApi
 */
export * from "@/modules/admin/api/adminProductsApi";
export * from "@/modules/admin/api/adminOrdersApi";
export * from "@/modules/admin/api/adminCategoriesApi";
export * from "@/modules/admin/api/adminBrandsApi";
export * from "@/modules/admin/api/adminUsersApi";
export * from "@/modules/admin/api/adminReviewsApi";
