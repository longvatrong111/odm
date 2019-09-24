function string(schemaType, value) {
    if ((schemaType.minLength && value.length < schemaType.minLength) || (schemaType.maxLength && value.length > schemaType.maxLength))
        return false;
    if (schemaType.enum && !schemaType.enum.includes(value))
        return false;

    return true;
}

module.exports = string;
