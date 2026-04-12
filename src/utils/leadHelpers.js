export const toLeadPayload = (data, source = 'website') => ({
  fullName: data.fullName,
  mobile: data.mobile,
  email: data.email || '',
  vehicleNumber: data.vehicleNumber,
  vehicleModel: data.vehicleModel,
  hasActivePolicy: data.hasActivePolicy || false,
  currentInsurer: data.currentInsurer || '',
  policyExpiry: data.policyExpiry || '',
  formType: data.serviceType,
  serviceTitle: data.serviceTitle || '',
  source,
});
