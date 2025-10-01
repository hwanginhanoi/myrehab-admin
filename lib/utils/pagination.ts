export function getPaginationInfo(
  pageIndex: number,
  pageSize: number,
  totalElements: number
) {
  const start = Math.min(pageIndex * pageSize + 1, totalElements);
  const end = Math.min((pageIndex + 1) * pageSize, totalElements);

  return { start, end, total: totalElements };
}
