import { post, get, rdelete, put } from './request';
import { getDomain } from '../utils/common';
import { getIntegration_mock } from './devLink';
import { integrations } from './productionLink';
import { IntegrationBase } from '../interface/integration';

const baseURLOject = getDomain();
const isMock = baseURLOject.MOCK;
const base = baseURLOject.APIBASE;

export function getIntegrations(params: any) {
  const url = isMock ? `${getIntegration_mock}` : base + integrations;
  return get(url, { params: params }).then((res) => res);
}

export function createIntegration(params: IntegrationBase) {
  const url = isMock ? `${getIntegration_mock}` : base + integrations;
  return post(url, { params: params }).then((res) => res);
}

export function updateIntegration(params: IntegrationBase) {
  const url = isMock ? `${getIntegration_mock}` : base + integrations;
  return put(url, { params: params }).then((res) => res);
}

export function deleteIntegration(params: { name: string }) {
  const url = isMock ? `${getIntegration_mock}` : base + integrations;
  return rdelete(url, { params: params }).then((res) => res);
}
