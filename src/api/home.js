import axios from 'Src/utils/axios';

export function IO_getRoleLLM(params) {
    return axios('/v1/models', {
      method: 'GET',
      params,
    });
  }
  
  export function IO_postLLM(data) {
    return axios('/v1/chat/completions', {
    // return axios('/ollama/api/chat', {
      method: 'POST',
      data,
    });
  }