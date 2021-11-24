import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:5000' ,headers: { 'Content-Type': 'application/json'}});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).access_token}`;
  }

  return req;
});

export const fetchPosts = () => API.get('/posts');
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

export const fetchProjects = () => API.get('/getProjects');
export const createProject = (newProject) => API.post('/addProject', newProject);
export const updateProject = (prj_id, updatedProject) => API.patch(`/updProject/${prj_id}`, updatedProject);
export const deleteProject = (prj_id) => API.delete(`/delProject/${prj_id}`);
export const fetchProject = (prj_id) => API.get(`/getProject/${prj_id}`)

export const fetchMembers = () => API.get('/getReactMember');

export const fetchProjectCosts = (prj_id) => API.get(`/getProjectCosts/${prj_id}`);
export const createProjectCost = (newProjectCost) => API.post('/addProjectCost', newProjectCost);
export const updateProjectCost = (prj_id,pc_id, updatedProjectCost) => API.patch(`/project/${prj_id}/updProjectCost/${pc_id}`, updatedProjectCost);
export const deleteProjectCost = (prj_id,pc_id) => API.delete(`/project/${prj_id}/delProjectCost/${pc_id}`);
//消費紀錄
export const fetchProjectCost = (prj_id,pc_id) => API.get(`/project/${prj_id}/getProjectCost/${pc_id}`)
//行程成員
export const fetchProjectMembers = (prj_id) => API.get(`/getProjectMembers/${prj_id}`);
//行程參與確認
export const projectMemberConfirm = (prj_id) => API.patch(`/project/${prj_id}/projectMemberConfirm`);
//拒絕參與行程
export const projectMemberCancel = (prj_id) => API.delete(`/project/${prj_id}/projectMemberCancel`);
//消費明細確認
export const projectCostConfirm = (prj_id,pc_id) => API.patch(`/project/${prj_id}/projectCost/${pc_id}/projectCostConfirm`);
