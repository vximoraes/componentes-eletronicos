export function generateParameters(schema, baseRef = '', parentKey = '') {
    const params = [];
    const properties = schema.properties || {};

    for (const [key, value] of Object.entries(properties)) {
        // Se value estiver indefinido, pula para o próximo
        if (!value) continue;

        const paramName = parentKey ? `${parentKey}.${key}` : key;

        if (value.type === 'object' && value.properties) {
            params.push(...generateParameters(value, baseRef, paramName));
        } else {
            params.push({
                name: paramName,
                in: 'query',
                required: false,
                schema: {
                    type: value.type || 'string',
                    format: value.format || undefined,
                    example: value.example || undefined
                },
                description: value.description || `Filtro por ${paramName}`
            });
        }
    }
    return params;
}