export interface PagedResponse<T> {
    items: T[];
    pageNuber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}