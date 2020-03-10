import medicalCareersWithSpecialties from '../../constants/medicalCareersWithSpecialties';

export default function createProviderName(providerInfo) {
  if (!medicalCareersWithSpecialties.includes(providerInfo.career)) {
    return providerInfo.career
  } else if (providerInfo.career === 'MD/DO') {
    return `${providerInfo.specialty} Physician, ${providerInfo.degree}`
  } else {
    return `${providerInfo.specialty} Provider, ${providerInfo.career}`
  }
};