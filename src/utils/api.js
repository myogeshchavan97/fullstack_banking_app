import axios from 'axios';
import { setAuthHeader, removeAuthHeader } from './common';

export const get = async (
  url,
  params,
  shouldSetAuthHeader = true,
  shouldRemoveAuthHeader = false
) => {
  if (shouldSetAuthHeader) {
    setAuthHeader();
  }
  const result = await axios.get(url, params);
  if (shouldRemoveAuthHeader) {
    removeAuthHeader();
  }
  return result;
};

export const post = async (
  url,
  params,
  shouldSetAuthHeader = true,
  shouldRemoveAuthHeader = false
) => {
  if (shouldSetAuthHeader) {
    setAuthHeader();
  }
  const result = await axios.post(url, params);
  if (shouldRemoveAuthHeader) {
    removeAuthHeader();
  }
  return result;
};

export const patch = async (
  url,
  params,
  shouldSetAuthHeader = true,
  shouldRemoveAuthHeader = false
) => {
  if (shouldSetAuthHeader) {
    setAuthHeader();
  }
  const result = await axios.patch(url, params);
  if (shouldRemoveAuthHeader) {
    removeAuthHeader();
  }
  return result;
};
