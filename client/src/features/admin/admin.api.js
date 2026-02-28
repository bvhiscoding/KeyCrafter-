/**
 * @deprecated
 * admin.api has been split into domain-specific files under
 * @/modules/admin/api/
 *
 * This file re-exports everything for backward compatibility.
 * Migrate imports to the new locations when convenient:
 *   - @/modules/admin/api/adminProducts.api
 *   - @/modules/admin/api/adminOrders.api
 *   - @/modules/admin/api/adminCategories.api
 *   - @/modules/admin/api/adminBrands.api
 *   - @/modules/admin/api/adminUsers.api
 *   - @/modules/admin/api/adminReviews.api
 */
export * from "@/modules/admin/api/adminProducts.api";
export * from "@/modules/admin/api/adminOrders.api";
export * from "@/modules/admin/api/adminCategories.api";
export * from "@/modules/admin/api/adminBrands.api";
export * from "@/modules/admin/api/adminUsers.api";
export * from "@/modules/admin/api/adminReviews.api";
export * from "@/modules/blog/api/blog.api";
