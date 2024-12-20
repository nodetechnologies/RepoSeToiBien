import _ from 'lodash';

function mapItemDetails(
  item,
  elementDetails = {},
  structure = {},
  t = (key) => key,
  currentLangCode = 'fr'
) {
  const attributeLabels = {
    attribute1: structure?.attribute1 ?? 'Default1',
    attribute2: structure?.attribute2 ?? 'Default2',
    attribute3: structure?.attribute3 ?? 'Default3',
  };

  const getRealLabel = (attributeValue) => {
    const formattedValue = attributeValue?.startsWith('data.')
      ? attributeValue.split('.')[1]
      : attributeValue;
    const field = structure?.fields?.find(
      (field) => field.value === formattedValue
    );
    return (
      field?.[`name_${currentLangCode}`] ||
      (attributeLabels.hasOwnProperty(attributeValue)
        ? t(attributeLabels[attributeValue])
        : t(attributeValue))
    );
  };

  const getSelectionsOnField = (attributeValue) => {
    const formattedValue = attributeValue?.startsWith('data.')
      ? attributeValue.split('.')[1]
      : attributeValue;
    const field = structure?.fields?.find(
      (field) => field.value === formattedValue
    );
    return field?.selections;
  };

  const mappedDetails =
    elementDetails?.data?.elements?.reduce((acc, curr) => {
      const rootValue = _.get(item, curr.value);
      const dataValue = _.get(item, `data.${curr.value}`, '');
      acc[curr.field] = {
        value:
          rootValue !== undefined && rootValue !== null && rootValue !== ''
            ? rootValue
            : dataValue,
        type: curr.type,
        field: curr.value,
        selections: getSelectionsOnField(curr.value),
      };
      return acc;
    }, {}) ?? {};

  const mappedDetailsLabel =
    elementDetails?.data?.elements?.reduce((acc, curr) => {
      const realLabel = getRealLabel(curr.value) ?? 'Default Label';
      acc[curr.field] = {
        label: realLabel,
        type: curr.type,
      };
      return acc;
    }, {}) ?? {};

  return { mappedDetails, mappedDetailsLabel };
}

export default mapItemDetails;
