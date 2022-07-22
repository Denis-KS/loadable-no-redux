export const fetchApis = () => fetch('https://api.publicapis.org/entries').then(result => result.json());
