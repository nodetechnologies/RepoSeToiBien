const evaluateConditions = (conditions, data) => {
  return conditions.reduce((acc, condition, index) => {
    const { field, operator, value, logic } = condition;
    let conditionMet;

    // Example of evaluating a condition
    switch (operator) {
      case '==':
        conditionMet = data[field] == value;
        break;
      case '!=':
        conditionMet = data[field] != value;
        break;
      case '>':
        conditionMet = data[field] > value;
        break;
      case '<':
        conditionMet = data[field] < value;
        break;
      default:
        conditionMet = false;
    }

    // Apply logical operator to combine conditions
    if (index === 0) {
      return conditionMet;
    } else {
      if (logic === 'AND') {
        return acc && conditionMet;
      } else if (logic === 'OR') {
        return acc || conditionMet;
      } else {
        return acc;
      }
    }
  }, true);
};

export default evaluateConditions;
