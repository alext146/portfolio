const formId = '1FAIpQLSc03o2glNj2DpuipxJsfqdZcU-UpCpzeu7-x8m1lGv0DD87-w';

const entryMap = {
  name: 'entry.791343280',
  email: 'entry.847895956',
  subject: 'entry.1249386301',
  message: 'entry.2073569407'
};

export const initialFormValues = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

export const buildFormUrl = (values) => {
  const url = new URL(`https://docs.google.com/forms/d/e/${formId}/formResponse`);
  Object.entries(entryMap).forEach(([key, entry]) => {
    url.searchParams.set(entry, values[key] ?? '');
  });
  return url;
};
