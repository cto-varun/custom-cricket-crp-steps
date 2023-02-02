import tabletInformation from '../../../utils/tabletInformation';
import ErrorModal from '../../../Modal/ErrorModal';

const errorHandlerCode = (validations) => {
  const warningErrors = []
  const codesNotAllowed = tabletInformation?.warningsCodeNotAllow;
  const notNullWarnings = validations.filter(validation  => validation?.warnings !== null);
  notNullWarnings.forEach(notNullWarning => {
    notNullWarning?.warnings.forEach(warn => {
      const warningCode = warn?.warningCode;
      if (codesNotAllowed.includes(parseInt(warningCode))) warningErrors.push(warn)
    })
  })
  const returningValue = warningErrors.length > 0
  return [
    returningValue,
    warningErrors,
    ErrorModal
  ]
}

export default errorHandlerCode;