export const handleSearch = () => {
  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');
  return search ? search.toLowerCase() : '';
}
