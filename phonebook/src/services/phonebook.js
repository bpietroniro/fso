import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const create = (newEntry) => {
  return axios.post(baseUrl, newEntry).then((res) => res.data);
};

const updateNumber = (entry) => {
  return axios.put(`${baseUrl}/${entry.id}`, entry).then((res) => res.data);
};

const deleteEntry = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((res) => res.data);
};

export default {
  getAll,
  create,
  updateNumber,
  deleteEntry,
};
