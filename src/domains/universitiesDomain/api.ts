export type UniversitiesParams = { country: string };

export const fetchUniversities = (params: UniversitiesParams) => {
    const url = 'http://universities.hipolabs.com/search';
    const queryParams = `country=${params['country']}`;
    return fetch(`${url}?${queryParams}`).then(result => result.json())
};
