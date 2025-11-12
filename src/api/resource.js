import request from '@/utils/request'
// import vendorRequest from '@/utils/vendorRequest'
// import Vue from 'vue'
/**
 * Simple RESTful resource class
 */
class Resource {
  constructor(uri) {
    this.uri = uri
  }

  list(query) {
    return request({
      url: `/${this.uri}`,
      method: 'get',
      params: query
    })
  }

  get(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'get'
    })
  }

  store(resource) {
    return request({
      url: `/${this.uri}`,
      method: 'post',
      data: resource
    })
  }

  update(id, resource) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'put',
      data: resource
    })
  }

  destroy(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'delete'
    })
  }

  vList(query) {
    return request({
      url: `/${this.uri}`,
      method: 'get',
      params: query
    })
  }

  vGet(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'get'
    })
  }

  vStore(resource) {
    return request({
      url: `/${this.uri}`,
      method: 'post',
      data: resource
    })
  }

  vUpdate(id, resource) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'put',
      data: resource
    })
  }

  vDestroy(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'delete'
    })
  }

  vList(query) {
    return request({
      url: `/${this.uri}`,
      method: 'get',
      params: query
    })
  }

  vGet(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'get'
    })
  }

  vStore(resource) {
    return request({
      url: `/${this.uri}`,
      method: 'post',
      data: resource
    })
  }

  vUpdate(id, resource) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'put',
      data: resource
    })
  }

  vDestroy(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'delete'
    })
  }
}

export { Resource as default }
